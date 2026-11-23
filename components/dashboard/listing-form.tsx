"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useState,
  useActionState,
} from "react";
import { Link } from "@/i18n/navigation";
import { Package, ShoppingCart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "cn";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { LISTING_CATEGORIES, LISTING_TYPE_META } from "@/lib/listings";
import {
  initialListingFormState,
  listingIssuesToFieldErrors,
  listingSchema,
} from "@/lib/validation/listing";
import type { ListingRow, ListingType } from "@/types/listing";
import {
  createListing,
  updateListing,
} from "@/utils/listings/actions";

function FormField({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const content = describedBy
    ? Children.map(children, (child) => {
        if (!isValidElement(child) || child.type === Select) return child;
        return cloneElement(
          child as React.ReactElement<{ "aria-describedby"?: string }>,
          { "aria-describedby": describedBy }
        );
      })
    : children;

  return (
    <Field className="gap-2" data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {optional ? (
          <span className="text-xs text-muted-foreground">Optional</span>
        ) : (
          <span className="text-xs text-muted-foreground">Required</span>
        )}
      </div>
      <FieldContent>
        {content}
        {hint ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        <FieldError
          id={errorId}
          errors={error ? [{ message: error }] : undefined}
        />
      </FieldContent>
    </Field>
  );
}

const textareaClass =
  "min-h-20 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30";

const STEPS = ["Type", "Basics", "Details", "Review"];

type FormValues = {
  type: ListingType;
  title: string;
  description: string;
  category: string;
  quantity: string;
  location: string;
  durationDays: string;
  qualityStandard: string;
  deliveryTimeline: string;
  preferredRegion: string;
  budgetRange: string;
  technicalDocument: string;
  images: string;
  price: string;
  currency: string;
  moq: string;
  certifications: string;
  incoterms: string;
  originCountry: string;
  deliveryOptions: string;
  technicalSpecs: string;
};

/** Which fields belong to each wizard step, used for validation and error jumps. */
const STEP_FIELDS: string[][] = [
  ["type"],
  ["title", "description", "category", "quantity", "location", "durationDays"],
  [
    "qualityStandard",
    "deliveryTimeline",
    "preferredRegion",
    "budgetRange",
    "technicalDocument",
    "price",
    "currency",
    "moq",
    "incoterms",
    "originCountry",
    "deliveryOptions",
    "certifications",
    "technicalSpecs",
    "images",
  ],
  [],
];

const FIELD_LABELS: Record<string, string> = {
  type: "listing type",
  title: "title",
  description: "description",
  category: "category",
  quantity: "quantity",
  location: "location",
  durationDays: "listing duration",
  qualityStandard: "quality standard",
  deliveryTimeline: "delivery timeline",
  preferredRegion: "preferred region",
  budgetRange: "budget range",
  technicalDocument: "technical document",
  price: "price",
  currency: "currency",
  moq: "minimum order quantity",
  incoterms: "incoterms",
  originCountry: "country of origin",
  deliveryOptions: "delivery options",
  certifications: "certifications",
  technicalSpecs: "technical specifications",
  images: "image URLs",
};

function firstErrorStep(errors: Record<string, string>) {
  for (let index = 0; index < STEP_FIELDS.length; index += 1) {
    if (STEP_FIELDS[index].some((name) => errors[name])) return index;
  }
  return 0;
}

function fieldHasValue(values: FormValues, name: string) {
  const value = values[name as keyof FormValues];
  return typeof value === "string" && value.trim().length > 0;
}

export function ListingForm({
  mode,
  defaultType,
  listing,
  basePath,
}: {
  mode: "create" | "edit";
  defaultType: ListingType;
  listing?: ListingRow | null;
  basePath: string;
}) {
  const initialType: ListingType =
    listing?.type === "available" || listing?.type === "wanted"
      ? listing.type
      : defaultType;

  const [v, setV] = useState<FormValues>({
    type: initialType,
    title: listing?.title ?? "",
    description: listing?.description ?? "",
    category: listing?.category ?? "",
    quantity: listing?.quantity ?? "",
    location: listing?.location ?? "",
    durationDays: String(listing?.durationDays ?? 30),
    qualityStandard: listing?.qualityStandard ?? "",
    deliveryTimeline: listing?.deliveryTimeline ?? "",
    preferredRegion: listing?.preferredRegion ?? "",
    budgetRange: listing?.budgetRange ?? "",
    technicalDocument: listing?.technicalDocument ?? "",
    images: (listing?.images ?? []).join("\n"),
    price: listing?.price ?? "",
    currency: listing?.currency ?? "",
    moq: listing?.moq ?? "",
    certifications: listing?.certifications ?? "",
    incoterms: listing?.incoterms ?? "",
    originCountry: listing?.originCountry ?? "",
    deliveryOptions: listing?.deliveryOptions ?? "",
    technicalSpecs: listing?.technicalSpecs ?? "",
  });
  const [step, setStep] = useState(0);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createListing : updateListing,
    initialListingFormState
  );

  useActionFeedback(state);

  const storageKey = `listing-form:${mode}:${listing?.id ?? "new"}`;

  // Restore an in-progress draft after a refresh (session-only, cleared on save).
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, unknown>;
        setV((prev) => {
          const next: FormValues = { ...prev };
          for (const key of Object.keys(prev) as Array<keyof FormValues>) {
            const value = saved[key];
            if (key === "type") {
              if (value === "wanted" || value === "available") next.type = value;
            } else if (typeof value === "string") {
              next[key] = value as never;
            }
          }
          return next;
        });
      }
    } catch {
      // Ignore unreadable or blocked drafts.
    }
    setRestored(true);
  }, [storageKey]);

  useEffect(() => {
    if (!restored) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(v));
    } catch {
      // Ignore quota or privacy-mode errors.
    }
  }, [restored, storageKey, v]);

  useEffect(() => {
    if (state.status !== "success") return;
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch {
      // Ignore storage errors.
    }
  }, [state.status, storageKey]);

  // Surface server-side field errors on the step that owns the first problem.
  useEffect(() => {
    if (!state.fieldErrors) return;
    const target = firstErrorStep(state.fieldErrors);
    setStep(target);
    const field = STEP_FIELDS[target].find((name) => state.fieldErrors?.[name]);
    if (field) setFocusField(field);
  }, [state]);

  useEffect(() => {
    if (!focusField) return;
    const element = document.getElementById(focusField);
    if (element) {
      element.focus({ preventScroll: true });
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setFocusField(null);
  }, [focusField]);

  const liveIssues = useMemo(() => {
    const parsed = listingSchema.safeParse(v);
    return parsed.success ? {} : listingIssuesToFieldErrors(parsed.error);
  }, [v]);

  // Show a message for fields that already have content (or after a failed
  // submit). Untouched empty fields are covered by the "to continue" summary.
  const errors: Record<string, string> = {};
  for (const [name, message] of Object.entries(liveIssues)) {
    if (fieldHasValue(v, name) || state.fieldErrors?.[name]) {
      errors[name] = message;
    }
  }

  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const update =
    (key: Exclude<keyof FormValues, "type">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setV((prev) => ({ ...prev, [key]: event.target.value }));

  const wanted = v.type === "wanted";

  const setField = (key: keyof FormValues, value: string) =>
    setV((prev) => ({ ...prev, [key]: value }));

  const missing = STEP_FIELDS[step].filter((name) => liveIssues[name]);
  const canAdvance = missing.length === 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!Object.keys(liveIssues).length) return;
    event.preventDefault();
    const target = firstErrorStep(liveIssues);
    setStep(target);
    const field = STEP_FIELDS[target].find((name) => liveIssues[name]);
    if (field) setFocusField(field);
    toast.error("Please fix the highlighted fields.");
  };

  const goNext = () => {
    if (!canAdvance) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="type" value={v.type} />
      {mode === "edit" && listing ? (
        <input type="hidden" name="id" value={listing.id} />
      ) : null}

      {/* Progress */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "border-2 border-primary text-primary"
                  : "border border-border text-muted-foreground"
              )}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium sm:inline",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <div
                className={cn(
                  "h-px flex-1",
                  i < step ? "bg-primary" : "bg-border"
                )}
              />
            ) : null}
          </div>
        ))}
      </div>

      {/* Step 0: Type */}
      <section className={cn("flex flex-col gap-3", step !== 0 && "hidden")}>
          <div>
            <h2 className="text-base font-semibold">What are you listing?</h2>
            <p className="text-xs text-muted-foreground">
              We defaulted this from your profile role. You can change it.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {LISTING_TYPE_META.map((item) => {
              const selected = v.type === item.value;
              const Icon = item.value === "wanted" ? ShoppingCart : Package;
              return (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setField("type", item.value)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-transparent hover:bg-muted/50"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-md",
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <FieldError errors={fieldError("type")} />
        </section>

      {/* Step 1: Basics */}
      <section className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
          <h2 className="text-base font-semibold">Listing basics</h2>

          <FormField
            id="title"
            label="Title"
            error={errors.title}
            hint="A clear product name, at least 3 characters."
          >
            <Input
              id="title"
              name="title"
              value={v.title}
              onChange={update("title")}
              placeholder="e.g. Premium green coffee beans, 500 kg"
              aria-invalid={Boolean(errors.title)}
            />
          </FormField>

          <FormField
            id="description"
            label="Description"
            error={errors.description}
            hint="At least 20 characters. Describe the goods, requirements, and key terms."
          >
            <textarea
              id="description"
              name="description"
              value={v.description}
              onChange={update("description")}
              rows={4}
              placeholder="Add the details a buyer or supplier needs to respond."
              aria-invalid={Boolean(errors.description)}
              className={textareaClass}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="category"
              label="Category"
              error={errors.category}
              hint="Pick the closest match; buyers filter by category."
            >
              <Select
                value={v.category}
                onValueChange={(value) =>
                  setField("category", String(value ?? ""))
                }
              >
                <SelectTrigger
                  id="category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category
                      ? "category-hint category-error"
                      : "category-hint"
                  }
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" name="category" value={v.category} />
            </FormField>

            <FormField
              id="quantity"
              label="Quantity"
              error={errors.quantity}
              hint="Include units, e.g. 500 kg or 1,000 units."
            >
              <Input
                id="quantity"
                name="quantity"
                value={v.quantity}
                onChange={update("quantity")}
                placeholder="e.g. 500 kg"
                aria-invalid={Boolean(errors.quantity)}
              />
            </FormField>

            <FormField
              id="location"
              label="Location"
              error={errors.location}
              hint="City and country, e.g. Addis Ababa, Ethiopia."
            >
              <Input
                id="location"
                name="location"
                value={v.location}
                onChange={update("location")}
                placeholder="e.g. Addis Ababa, Ethiopia"
                aria-invalid={Boolean(errors.location)}
              />
            </FormField>

            <FormField
              id="durationDays"
              label="Listing duration (days)"
              error={errors.durationDays}
              hint="How long the listing stays live once approved (1–365 days)."
            >
              <Input
                id="durationDays"
                name="durationDays"
                type="number"
                min={1}
                max={365}
                value={v.durationDays}
                onChange={update("durationDays")}
                aria-invalid={Boolean(errors.durationDays)}
              />
            </FormField>
          </div>
        </section>

      {/* Step 2: Details */}
      <section className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
          {wanted ? (
            <>
              <div>
                <h2 className="text-base font-semibold">Buyer requirements</h2>
                <p className="text-xs text-muted-foreground">
                  These help suppliers decide whether they can fulfil your request.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="qualityStandard"
                  label="Quality standard"
                  error={errors.qualityStandard}
                  hint="Grade, certifications, or the spec you need."
                >
                  <Input
                    id="qualityStandard"
                    name="qualityStandard"
                    value={v.qualityStandard}
                    onChange={update("qualityStandard")}
                    placeholder="e.g. Grade 1, organic certified"
                    aria-invalid={Boolean(errors.qualityStandard)}
                  />
                </FormField>

                <FormField
                  id="deliveryTimeline"
                  label="Delivery timeline"
                  error={errors.deliveryTimeline}
                  hint="When you need it delivered, e.g. within 30 days."
                >
                  <Input
                    id="deliveryTimeline"
                    name="deliveryTimeline"
                    value={v.deliveryTimeline}
                    onChange={update("deliveryTimeline")}
                    placeholder="e.g. Within 30 days"
                    aria-invalid={Boolean(errors.deliveryTimeline)}
                  />
                </FormField>

                <FormField
                  id="preferredRegion"
                  label="Preferred region"
                  error={errors.preferredRegion}
                  hint="Where suppliers should ship from or to."
                >
                  <Input
                    id="preferredRegion"
                    name="preferredRegion"
                    value={v.preferredRegion}
                    onChange={update("preferredRegion")}
                    placeholder="e.g. East Africa"
                    aria-invalid={Boolean(errors.preferredRegion)}
                  />
                </FormField>

                <FormField
                  id="budgetRange"
                  label="Budget range"
                  error={errors.budgetRange}
                  hint="Include the currency, e.g. USD 10,000 – 25,000."
                >
                  <Input
                    id="budgetRange"
                    name="budgetRange"
                    value={v.budgetRange}
                    onChange={update("budgetRange")}
                    placeholder="e.g. USD 10,000 – 25,000"
                    aria-invalid={Boolean(errors.budgetRange)}
                  />
                </FormField>
              </div>

              <FormField
                id="technicalDocument"
                label="Technical document"
                error={errors.technicalDocument}
                optional
                hint="Paste a link to a PDF or document."
              >
                <Input
                  id="technicalDocument"
                  name="technicalDocument"
                  type="url"
                  value={v.technicalDocument}
                  onChange={update("technicalDocument")}
                  placeholder="https://example.com/specification.pdf"
                  aria-invalid={Boolean(errors.technicalDocument)}
                />
              </FormField>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-base font-semibold">Seller details</h2>
                <p className="text-xs text-muted-foreground">
                  Buyers use these details to compare your offer.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="price" label="Price" error={errors.price}>
                  <Input
                    id="price"
                    name="price"
                    value={v.price}
                    onChange={update("price")}
                    placeholder="e.g. USD 4.50 per kg"
                    aria-invalid={Boolean(errors.price)}
                  />
                </FormField>

                <FormField id="currency" label="Currency" error={errors.currency} optional>
                  <Input
                    id="currency"
                    name="currency"
                    value={v.currency}
                    onChange={update("currency")}
                    placeholder="e.g. USD, EUR"
                    aria-invalid={Boolean(errors.currency)}
                  />
                </FormField>

                <FormField id="moq" label="Min. order qty" error={errors.moq} optional>
                  <Input
                    id="moq"
                    name="moq"
                    value={v.moq}
                    onChange={update("moq")}
                    placeholder="e.g. 300 kg"
                    aria-invalid={Boolean(errors.moq)}
                  />
                </FormField>

                <FormField id="incoterms" label="Incoterms" error={errors.incoterms} optional>
                  <Input
                    id="incoterms"
                    name="incoterms"
                    value={v.incoterms}
                    onChange={update("incoterms")}
                    placeholder="e.g. FOB, CIF, DDP"
                    aria-invalid={Boolean(errors.incoterms)}
                  />
                </FormField>

                <FormField id="originCountry" label="Country of origin" error={errors.originCountry} optional>
                  <Input
                    id="originCountry"
                    name="originCountry"
                    value={v.originCountry}
                    onChange={update("originCountry")}
                    placeholder="e.g. Ethiopia"
                    aria-invalid={Boolean(errors.originCountry)}
                  />
                </FormField>

                <FormField
                  id="deliveryOptions"
                  label="Delivery options"
                  error={errors.deliveryOptions}
                >
                  <Input
                    id="deliveryOptions"
                    name="deliveryOptions"
                    value={v.deliveryOptions}
                    onChange={update("deliveryOptions")}
                    placeholder="e.g. FOB Djibouti, 2–3 weeks"
                    aria-invalid={Boolean(errors.deliveryOptions)}
                  />
                </FormField>
              </div>

              <FormField
                id="certifications"
                label="Certifications"
                error={errors.certifications}
                optional
                hint="Comma-separated, e.g. GOTS, ISO 9001, Organic."
              >
                <Input
                  id="certifications"
                  name="certifications"
                  value={v.certifications}
                  onChange={update("certifications")}
                  placeholder="e.g. GOTS, ISO 9001"
                  aria-invalid={Boolean(errors.certifications)}
                />
              </FormField>

              <FormField
                id="technicalSpecs"
                label="Technical specifications"
                error={errors.technicalSpecs}
                optional
              >
                <textarea
                  id="technicalSpecs"
                  name="technicalSpecs"
                  value={v.technicalSpecs}
                  onChange={update("technicalSpecs")}
                  rows={3}
                  placeholder="Packaging, dimensions, or other specs."
                  aria-invalid={Boolean(errors.technicalSpecs)}
                  className={textareaClass}
                />
              </FormField>

              <FormField
                id="images"
                label="Image URLs"
                error={errors.images}
                optional
                hint="One image URL per line, up to 6."
              >
                <textarea
                  id="images"
                  name="images"
                  value={v.images}
                  onChange={update("images")}
                  rows={3}
                  placeholder={"https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"}
                  aria-invalid={Boolean(errors.images)}
                  className={textareaClass}
                />
              </FormField>
            </>
          )}
        </section>

      {/* Step 3: Review */}
      <section className={cn("flex flex-col gap-4", step !== 3 && "hidden")}>
          <h2 className="text-base font-semibold">Review & submit</h2>
          <div className="rounded-xl border bg-muted/20 p-4 text-sm">
            <p className="font-medium">{v.title || "Untitled listing"}</p>
            <p className="text-xs text-muted-foreground">
              {v.type === "wanted" ? "Wanted" : "Available"} · {v.category || "—"} · {v.location || "—"}
            </p>
            <p className="mt-2 line-clamp-3 text-muted-foreground">{v.description}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            New and edited listings are reviewed by an admin before going live.
          </p>
        </section>

      {step > 0 && step < STEPS.length - 1 && missing.length ? (
        <p role="status" className="text-xs text-muted-foreground">
          To continue, add:{" "}
          {missing.map((name) => FIELD_LABELS[name] ?? name).join(", ")}.
        </p>
      ) : null}

      {/* Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={step === 0 || isPending}
        >
          <ChevronLeft className="size-4" /> Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            render={<Link href={basePath} />}
            variant="ghost"
            nativeButton={false}
            disabled={isPending}
          >
            Cancel
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={goNext}
              disabled={isPending || !canAdvance}
              title={
                canAdvance
                  ? undefined
                  : "Complete the required fields in this step to continue."
              }
            >
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : mode === "create"
                ? "Submit listing"
                : "Save changes"}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}