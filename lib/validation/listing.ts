import { z } from "zod";
import { normalizeCountryCode } from "@/lib/countries";
import { parseTagSlugs } from "@/lib/slug";

const optionalText = (max: number) => z.string().trim().max(max).default("");

const MAX_TAGS = 8;

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

export const listingBaseSchema = z.object({
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
    countryCode: z
      .string()
      .trim()
      .max(60)
      .default("")
      .transform((value) => normalizeCountryCode(value) ?? "")
      .refine((value) => value === "" || /^[A-Z]{2}$/.test(value), {
        message: "Select a valid country.",
      }),
    tags: z
      .string()
      .trim()
      .max(300, "Tags are too long.")
      .default("")
      .refine((value) => parseTagSlugs(value, MAX_TAGS + 1).length <= MAX_TAGS, {
        message: `Add up to ${MAX_TAGS} tags.`,
      }),
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
    currency: optionalText(20),
    moq: optionalText(120),
    certifications: optionalText(500),
    incoterms: optionalText(120),
    originCountry: optionalText(120),
    deliveryOptions: optionalText(500),
    technicalSpecs: optionalText(3000),
});

type WantedRequirementValues = Pick<
  z.infer<typeof listingBaseSchema>,
  | "type"
  | "qualityStandard"
  | "deliveryTimeline"
  | "preferredRegion"
  | "budgetRange"
  | "technicalDocument"
>;

type AvailableOfferValues = Pick<
  z.infer<typeof listingBaseSchema>,
  "type" | "price" | "deliveryOptions"
>;

type ImageValues = Pick<z.infer<typeof listingBaseSchema>, "images">;

function refineWanted(values: WantedRequirementValues, ctx: z.RefinementCtx) {
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
}

function refineAvailable(values: AvailableOfferValues, ctx: z.RefinementCtx) {
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
}

function refineImages(values: ImageValues, ctx: z.RefinementCtx) {
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
}

export const listingSchema = listingBaseSchema.superRefine((values, ctx) => {
  if (values.type === "wanted") {
    refineWanted(values, ctx);
    return;
  }
  refineAvailable(values, ctx);
  refineImages(values, ctx);
});

export const listingTypeStepSchema = listingBaseSchema.pick({ type: true });

export const listingBasicsStepSchema = listingBaseSchema.pick({
  type: true,
  title: true,
  description: true,
  category: true,
  quantity: true,
  location: true,
  durationDays: true,
});

export const listingDetailsStepSchema = listingBaseSchema
  .pick({
    type: true,
    qualityStandard: true,
    deliveryTimeline: true,
    preferredRegion: true,
    budgetRange: true,
    technicalDocument: true,
    price: true,
    deliveryOptions: true,
    images: true,
  })
  .superRefine((values, ctx) => {
    if (values.type === "wanted") {
      refineWanted(values, ctx);
      return;
    }
    refineAvailable(values, ctx);
    refineImages(values, ctx);
  });

/** One schema per wizard step, in order. Index 3 validates the whole listing. */
export const LISTING_STEP_SCHEMAS = [
  listingTypeStepSchema,
  listingBasicsStepSchema,
  listingDetailsStepSchema,
  listingSchema,
] as const;

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
