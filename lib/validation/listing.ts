import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).default("");

const urlPattern = /^https?:\/\/[^\s]+$/i;

function addUrlIssue(
  value: string,
  path: string,
  ctx: z.RefinementCtx,
  message = "Enter a valid URL starting with http:// or https://."
) {
  if (value && !urlPattern.test(value)) {
    ctx.addIssue({ code: "custom", path: [path], message });
  }
}

export const listingSchema = z
  .object({
    type: z.enum(["wanted", "available"], {
      message: "Select a listing type.",
    }),
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(160, "Title must be 160 characters or fewer."),
    description: z
      .string()
      .trim()
      .min(20, "Description must be at least 20 characters.")
      .max(5000, "Description must be 5,000 characters or fewer."),
    category: z.string().trim().min(1, "Select a category."),
    quantity: z
      .string()
      .trim()
      .min(1, "Enter a quantity.")
      .max(60, "Quantity must be 60 characters or fewer."),
    location: z
      .string()
      .trim()
      .min(1, "Enter a location.")
      .max(120, "Location must be 120 characters or fewer."),
    durationDays: z.coerce
      .number()
      .int("Enter a whole number of days.")
      .min(1, "Duration must be at least 1 day.")
      .max(365, "Duration must be 365 days or fewer."),

    qualityStandard: optionalText(500),
    deliveryTimeline: optionalText(200),
    preferredRegion: optionalText(200),
    budgetRange: optionalText(120),
    technicalDocument: optionalText(500),

    images: z.string().max(4000, "Image URLs are too long.").default(""),
    price: optionalText(120),
    deliveryOptions: optionalText(500),
    technicalSpecs: optionalText(3000),
  })
  .superRefine((values, ctx) => {
    if (values.type === "wanted") {
      if (!values.qualityStandard) {
        ctx.addIssue({
          code: "custom",
          path: ["qualityStandard"],
          message: "Describe the quality standard you require.",
        });
      }
      if (!values.deliveryTimeline) {
        ctx.addIssue({
          code: "custom",
          path: ["deliveryTimeline"],
          message: "Enter your required delivery timeline.",
        });
      }
      if (!values.preferredRegion) {
        ctx.addIssue({
          code: "custom",
          path: ["preferredRegion"],
          message: "Enter your preferred region.",
        });
      }
      if (!values.budgetRange) {
        ctx.addIssue({
          code: "custom",
          path: ["budgetRange"],
          message: "Enter your budget range.",
        });
      }
      addUrlIssue(values.technicalDocument, "technicalDocument", ctx);
      return;
    }

    if (!values.price) {
      ctx.addIssue({
        code: "custom",
        path: ["price"],
        message: "Enter a price or price range.",
      });
    }
    if (!values.deliveryOptions) {
      ctx.addIssue({
        code: "custom",
        path: ["deliveryOptions"],
        message: "Describe your delivery options.",
      });
    }

    const images = values.images
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (images.length > 6) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Add up to 6 image URLs.",
      });
    }
    images.forEach((image) => addUrlIssue(image, "images", ctx));
  });

export const listingModerationNoteSchema = z.object({
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be 2,000 characters or fewer.")
    .default(""),
});

export const listingRejectionSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Give the user a clear reason (at least 5 characters).")
    .max(1000, "Rejection reason must be 1,000 characters or fewer."),
});

export const listingBulkRejectionSchema = listingRejectionSchema.extend({
  ids: z
    .array(z.string().trim().min(1))
    .min(1, "Select at least one listing.")
    .max(100, "Select up to 100 listings at a time."),
});

export type ListingFormValues = z.infer<typeof listingSchema>;

export type ListingFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export const initialListingFormState: ListingFormState = { status: "idle" };

export function listingIssuesToFieldErrors(
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
