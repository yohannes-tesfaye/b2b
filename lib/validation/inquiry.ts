import { z } from "zod";

export const conversationStartSchema = z.object({
  listingId: z.string().trim().min(1, "Listing is required."),
  name: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters).")
    .max(120, "Name must be 120 characters or fewer."),
  buyerEmail: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .max(200, "Email must be 200 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(4000, "Message must be 4,000 characters or fewer."),
});

export const messageSchema = z.object({
  conversationId: z.string().trim().min(1, "Conversation is required."),
  body: z
    .string()
    .trim()
    .min(1, "Message cannot be empty.")
    .max(4000, "Message must be 4,000 characters or fewer."),
  attachment: z.string().optional(),
});

export type ConversationStartValues = z.infer<typeof conversationStartSchema>;
export type MessageValues = z.infer<typeof messageSchema>;

export type InquiryFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export const initialInquiryFormState: InquiryFormState = { status: "idle" };

export function inquiryIssuesToFieldErrors(
  error: z.ZodError
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (fieldErrors[field]) continue;
    fieldErrors[field] = issue.message;
  }
  return fieldErrors;
}
