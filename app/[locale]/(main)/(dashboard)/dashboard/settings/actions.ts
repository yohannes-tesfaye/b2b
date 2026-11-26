"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";
import { getApprovalSettings } from "@/features/listings/approval";

export async function updateApprovalSettings(input: {
  listingApprovalEnabled?: boolean;
  autoApproveVerified?: boolean;
}) {
  const admin = await requireAdmin();

  const current = await getApprovalSettings();
  const data = {
    listingApprovalEnabled:
      input.listingApprovalEnabled ?? current.listingApprovalEnabled,
    autoApproveVerified:
      input.autoApproveVerified ?? current.autoApproveVerified,
  };

  await prisma.appSettings.upsert({
    where: { id: "default" },
    update: { ...data, updatedById: admin.id },
    create: { id: "default", ...data, updatedById: admin.id },
  });

  revalidatePath("/[locale]/dashboard/settings", "page");
}

export async function setUserRequiresReview(userId: string, value: boolean) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { requiresReview: value },
  });

  revalidatePath("/[locale]/dashboard/user", "page");
  revalidatePath("/[locale]/dashboard/user/[id]", "page");
}
