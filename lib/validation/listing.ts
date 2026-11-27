import { z } from "zod";
import { normalizeCountryCode } from "@/lib/countries";
import { parseTagSlugs } from "@/lib/slug";

const optionalText = (max: number) => z.string().trim().max(max).default("");

/** Single source of truth for length limits, used by Zod and by `maxLength`. */
export const LISTING_LIMITS = {
  titleMin: 3,
  title: 160,
  descriptionMin: 20,
  description: 5000,
  quantity: 60,
  location: 120,
  countryCode: 60,
  tags: 300,
  maxTags: 8,
  durationMin: 1,
  durationMax: 365,
  durationDaysMaxLength: 3,
  qualityStandard: 500,
  deliveryTimeline: 200,
  preferredRegion: 200,
  budgetRange: 120,
  technicalDocument: 500,
  images: 8_000_000,
  maxImages: 6,
  price: 120,
  currency: 20,
  moq: 120,
  certifications: 500,
  incoterms: 120,
  originCountry: 120,
  deliveryOptions: 500,
  technicalSpecs: 3000,
} as const;

const MAX_TAGS = LISTING_LIMITS.maxTags;

/**
 * Every text field the wizard submits. Server actions build their input from
 * this list so FormData parsing can never drift from `listingSchema`.
 */
export const LISTING_FORM_FIELD_KEYS = [
  "type",
  "title",
  "description",
  "category",
  "quantity",
  "location",
  "countryCode",
  "tags",
  "durationDays",
  "qualityStandard",
  "deliveryTimeline",
  "preferredRegion",
  "budgetRange",
  "technicalDocument",
  "images",
  "price",
  "currency",
  "moq",
  "certifications",
  "incoterms",
  "originCountry",
  "deliveryOptions",
  "technicalSpecs",
] as const;

const urlPattern = /^https?:\/\/[^\s]+$/i;

/** Locally uploaded images are stored as resized base64 data URLs. */
const dataImagePattern = /^data:image\/(png|jpe?g|webp|gif);base64,/i;

/** A listing image is either an http(s) URL or an uploaded data URL. */
export function isListingImageUrl(value: string): boolean {
  return urlPattern.test(value) || dataImagePattern.test(value);
}

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
      .min(LISTING_LIMITS.titleMin, `Title must be at least ${LISTING_LIMITS.titleMin} characters.`)
      .max(LISTING_LIMITS.title, `Title must be ${LISTING_LIMITS.title} characters or fewer.`),
    description: z
      .string()
      .trim()
      .min(LISTING_LIMITS.descriptionMin, `Description must be at least ${LISTING_LIMITS.descriptionMin} characters.`)
      .max(LISTING_LIMITS.description, `Description must be ${LISTING_LIMITS.description.toLocaleString("en-US")} characters or fewer.`),
    category: z.string().trim().min(1, "Select a category."),
    quantity: z
      .string()
      .trim()
      .min(1, "Enter a quantity.")
      .max(LISTING_LIMITS.quantity, `Quantity must be ${LISTING_LIMITS.quantity} characters or fewer.`),
    location: z
      .string()
      .trim()
      .min(1, "Enter a location.")
      .max(LISTING_LIMITS.location, `Location must be ${LISTING_LIMITS.location} characters or fewer.`),
    countryCode: z
      .string()
      .trim()
      .max(LISTING_LIMITS.countryCode)
      .default("")
      .transform((value) => normalizeCountryCode(value) ?? "")
      .refine((value) => value === "" || /^[A-Z]{2}$/.test(value), {
        message: "Select a valid country.",
      }),
    tags: z
      .string()
      .trim()
      .max(LISTING_LIMITS.tags, "Tags are too long.")
      .default("")
      .refine((value) => parseTagSlugs(value, MAX_TAGS + 1).length <= MAX_TAGS, {
        message: `Add up to ${MAX_TAGS} tags.`,
      }),
    durationDays: z
      .string()
      .trim()
      .min(1, "Enter a listing duration in days.")
      .regex(/^\d+$/, "Use a whole number of days, e.g. 30.")
      .transform((value) => Number(value))
      .pipe(
        z
          .number()
          .int("Enter a whole number of days.")
          .min(LISTING_LIMITS.durationMin, `Duration must be at least ${LISTING_LIMITS.durationMin} day.`)
          .max(LISTING_LIMITS.durationMax, `Duration must be ${LISTING_LIMITS.durationMax} days or fewer.`)
      ),

    qualityStandard: optionalText(LISTING_LIMITS.qualityStandard),
    deliveryTimeline: optionalText(LISTING_LIMITS.deliveryTimeline),
    preferredRegion: optionalText(LISTING_LIMITS.preferredRegion),
    budgetRange: optionalText(LISTING_LIMITS.budgetRange),
    technicalDocument: optionalText(LISTING_LIMITS.technicalDocument),

    images: z.string().max(LISTING_LIMITS.images, "Image URLs are too long.").default(""),
    price: optionalText(LISTING_LIMITS.price),
    currency: optionalText(LISTING_LIMITS.currency),
    moq: optionalText(LISTING_LIMITS.moq),
    certifications: optionalText(LISTING_LIMITS.certifications),
    incoterms: optionalText(LISTING_LIMITS.incoterms),
    originCountry: optionalText(LISTING_LIMITS.originCountry),
    deliveryOptions: optionalText(LISTING_LIMITS.deliveryOptions),
    technicalSpecs: optionalText(LISTING_LIMITS.technicalSpecs),
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

  if (images.length > LISTING_LIMITS.maxImages) {
    ctx.addIssue({
      code: "custom",
      path: ["images"],
      message: `Add up to ${LISTING_LIMITS.maxImages} images.`,
    });
  }
  images.forEach((image) => {
    if (image && !isListingImageUrl(image)) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Enter a valid image URL starting with http:// or https://, or upload an image.",
      });
    }
  });
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

