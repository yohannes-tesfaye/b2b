"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/site-url";
import {
  conversationStartSchema,
  messageSchema,
  inquiryIssuesToFieldErrors,
  type InquiryFormState,
} from "@/lib/validation/inquiry";

const RATE_LIMIT_PER_DAY = 20;

function messagePreview(body: string) {
  return body.slice(0, 140).replace(/\s+/g, " ").trim();
}

/**
 * Send a new inquiry about a listing. The buyer and seller are the participants;
 * if a thread already exists for this (listing, buyer) pair, the new message is
 * appended to it instead of creating a duplicate.
 *
 * Requires a signed-in buyer. Guests use the mailto fallback on the listing
 * page instead.
 */
export async function startConversation(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const parsed = conversationStartSchema.safeParse({
    listingId: String(formData.get("listingId") ?? ""),
    name: String(formData.get("name") ?? ""),
    buyerEmail: String(formData.get("buyerEmail") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: inquiryIssuesToFieldErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Please sign in to send a message.",
      redirectTo: `/log-in?next=${encodeURIComponent(
        `/products/${parsed.data.listingId}?contact=1`
      )}`,
    };
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    select: {
      id: true,
      title: true,
      status: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          companyName: true,
          banned: true,
        },
      },
    },
  });

  if (!listing) {
    return { status: "error", message: "Listing not found." };
  }

  if (listing.userId === user.id) {
    return { status: "error", message: "You cannot message your own listing." };
  }

  if (listing.user.banned) {
    return { status: "error", message: "This seller is not available." };
  }

  if (listing.status !== "active") {
    return {
      status: "error",
      message: "This listing is no longer active.",
    };
  }

  // Rate limit: max N new threads per buyer per day.
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const recentCount = await prisma.conversation.count({
    where: {
      buyerId: user.id,
      createdAt: { gte: startOfDay },
    },
  });
  if (recentCount >= RATE_LIMIT_PER_DAY) {
    return {
      status: "error",
      message: `You've reached the daily limit of ${RATE_LIMIT_PER_DAY} new conversations. Please try again tomorrow.`,
    };
  }

  const seller = listing.user;

  // Reuse an existing thread for this buyer/listing pair, or create a new one.
  const conversation = await prisma.conversation.upsert({
    where: {
      listingId_buyerId: {
        listingId: listing.id,
        buyerId: user.id,
      },
    },
    update: {
      lastMessageAt: new Date(),
      lastMessagePreview: messagePreview(parsed.data.message),
      buyerUnread: 0,
      sellerUnread: { increment: 1 },
    },
    create: {
      listingId: listing.id,
      buyerId: user.id,
      sellerId: seller.id,
      subject: `Inquiry about "${listing.title}"`,
      buyerUnread: 0,
      sellerUnread: 1,
      lastMessageAt: new Date(),
      lastMessagePreview: messagePreview(parsed.data.message),
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: parsed.data.message,
    },
  });

  // Increment the legacy counter so it stays roughly in sync.
  await prisma.listing.update({
    where: { id: listing.id },
    data: { inquiries: { increment: 1 } },
  });

  // Email the seller (fire-and-forget; do not block the response).
  const siteUrl = getSiteUrl();
  const threadUrl = `${siteUrl}/en/${seller.id}/dashboard/messages/${conversation.id}`;
  sendEmail({
    to: seller.email,
    subject: `New inquiry: "${listing.title}"`,
    html: `<p>Hi ${seller.name ?? ""},</p>
<p>You have a new message about <strong>${listing.title}</strong>.</p>
<blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
${parsed.data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
</blockquote>
<p>Reply here: <a href="${threadUrl}">${threadUrl}</a></p>`,
  }).catch((error) => {
    console.error("[inquiry] seller notification failed", error);
  });

  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages/[id]", "page");

  return {
    status: "success",
    message: "Message sent. The seller will be notified.",
    redirectTo: `/messages/${conversation.id}`,
  };
}

/**
 * Open (or start) a chat with a trader directly from their public profile.
 * Reuses the buyer's most recent thread with that seller, otherwise attaches a
 * new thread to the seller's latest active listing. Returns a redirect target
 * for the client to follow; `redirectTo` points at the locale-less
 * `/messages/[id]` resolver.
 */
export async function startChatWithSeller(
  sellerId: string
): Promise<{ redirectTo?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      redirectTo: `/log-in?next=${encodeURIComponent(`/profile/${sellerId}`)}`,
    };
  }

  if (user.id === sellerId) {
    return { error: "This is your own profile." };
  }

  const seller = await prisma.user.findUnique({
    where: { id: sellerId },
    select: { id: true, banned: true },
  });

  if (!seller || seller.banned) {
    return { error: "This trader is not available." };
  }

  // Reuse an existing conversation with this seller when there is one.
  const existing = await prisma.conversation.findFirst({
    where: { buyerId: user.id, sellerId: seller.id },
    orderBy: { lastMessageAt: "desc" },
    select: { id: true },
  });
  if (existing) {
    return { redirectTo: `/messages/${existing.id}` };
  }

  // Otherwise anchor the new thread to their most recent active listing.
  const listing = await prisma.listing.findFirst({
    where: {
      userId: seller.id,
      status: "active",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
  });

  if (!listing) {
    return {
      error: "This trader has no active listings to message about yet.",
    };
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      listingId_buyerId: { listingId: listing.id, buyerId: user.id },
    },
    update: {},
    create: {
      listingId: listing.id,
      buyerId: user.id,
      sellerId: seller.id,
      subject: `Inquiry about "${listing.title}"`,
      lastMessageAt: new Date(),
      lastMessagePreview: "New conversation",
    },
  });

  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages", "page");

  return { redirectTo: `/messages/${conversation.id}` };
}

/**
 * Append a message to an existing conversation. Only the two participants may
 * post; the unread counter for the *other* participant is incremented.
 */
export async function sendMessage(
  _prevState: InquiryFormState,
  formData: FormData
): Promise<InquiryFormState> {
  const parsed = messageSchema.safeParse({
    conversationId: String(formData.get("conversationId") ?? ""),
    body: String(formData.get("body") ?? ""),
    attachment: String(formData.get("attachment") ?? "") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: inquiryIssuesToFieldErrors(parsed.error),
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return {
      status: "error",
      message: "Please sign in to send a message.",
      redirectTo: "/log-in",
    };
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: parsed.data.conversationId },
    select: {
      id: true,
      buyerId: true,
      sellerId: true,
      status: true,
      listing: { select: { id: true, title: true } },
      buyer: { select: { id: true, name: true, email: true } },
      seller: { select: { id: true, name: true, email: true } },
    },
  });

  if (!conversation) {
    return { status: "error", message: "Conversation not found." };
  }

  const isBuyer = conversation.buyerId === user.id;
  const isSeller = conversation.sellerId === user.id;
  if (!isBuyer && !isSeller) {
    return { status: "error", message: "You are not a participant in this conversation." };
  }

  if (conversation.status === "archived") {
    return { status: "error", message: "This conversation is archived." };
  }

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: parsed.data.body,
      attachment: parsed.data.attachment || null,
    },
  });

  const preview = messagePreview(parsed.data.body);
  const now = new Date();

  if (isBuyer) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: now,
        lastMessagePreview: preview,
        sellerUnread: { increment: 1 },
        buyerLastReadAt: now,
        buyerUnread: 0,
      },
    });
  } else {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageAt: now,
        lastMessagePreview: preview,
        buyerUnread: { increment: 1 },
        sellerLastReadAt: now,
        sellerUnread: 0,
      },
    });
  }

  // Notify the counterpart (fire-and-forget).
  const counterpart = isBuyer ? conversation.seller : conversation.buyer;
  const counterpartIsBuyer = !isBuyer;
  const counterpartPath = counterpartIsBuyer
    ? `${counterpart.id}/dashboard/messages/${conversation.id}`
    : `${counterpart.id}/dashboard/messages/${conversation.id}`;
  const threadUrl = `${getSiteUrl()}/en/${counterpartPath}`;
  sendEmail({
    to: counterpart.email,
    subject: `Re: ${conversation.listing.title}`,
    html: `<p>Hi ${counterpart.name ?? ""},</p>
<p>You have a new reply about <strong>${conversation.listing.title}</strong>.</p>
<blockquote style="border-left:3px solid #ccc;padding-left:12px;color:#555;">
${parsed.data.body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
</blockquote>
<p>View the conversation: <a href="${threadUrl}">${threadUrl}</a></p>`,
  }).catch((error) => {
    console.error("[inquiry] reply notification failed", error);
  });

  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages/[id]", "page");
  revalidatePath("/[locale]/messages/[id]", "page");

  return {
    status: "success",
    message: "Message sent.",
    redirectTo: `/messages/${conversation.id}`,
  };
}

/**
 * Mark a conversation as read for the current user.
 */
export async function markRead(conversationId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { buyerId: true, sellerId: true },
  });
  if (!conversation) return;

  const now = new Date();
  if (conversation.buyerId === user.id) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { buyerUnread: 0, buyerLastReadAt: now },
    });
  } else if (conversation.sellerId === user.id) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { sellerUnread: 0, sellerLastReadAt: now },
    });
  }
}

/**
 * Archive a conversation (owner/participant only).
 */
export async function archiveConversation(conversationId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) return;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { buyerId: true, sellerId: true },
  });
  if (!conversation) return;
  if (conversation.buyerId !== user.id && conversation.sellerId !== user.id) return;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "archived" },
  });

  revalidatePath("/[locale]/[userId]/dashboard", "page");
  revalidatePath("/[locale]/[userId]/dashboard/messages", "page");
}
