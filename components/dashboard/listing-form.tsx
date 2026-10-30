"use client";

import { useState, useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { Package, ShoppingCart } from "lucide-react";
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
  return (
    <Field className="gap-2" data-invalid={Boolean(error)}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        {optional ? (
          <span className="text-xs text-muted-foreground">Optional</span>
        ) : null}
      </div>
      <FieldContent>
        {children}
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        <FieldError errors={error ? [{ message: error }] : undefined} />
      </FieldContent>
    </Field>
  );
}

const textareaClass =
  "min-h-24 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30";

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

  const [v, setV] = useState({
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
    deliveryOptions: listing?.deliveryOptions ?? "",
    technicalSpecs: listing?.technicalSpecs ?? "",
  });
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [state, formAction, isPending] = useActionState(
    mode === "create" ? createListing : updateListing,
    initialListingFormState
  );

  useActionFeedback(state);

  const errors = { ...state.fieldErrors, ...clientErrors };
  const fieldError = (name: string) =>
    errors[name] ? [{ message: errors[name] }] : undefined;

  const update =
    (key: Exclude<keyof typeof v, "type">) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setV((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = listingSchema.safeParse(v);
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(listingIssuesToFieldErrors(parsed.error));
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setClientErrors({});
  };

  const wanted = v.type === "wanted";

  return (
    <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input type="hidden" name="type" value={v.type} />
      {mode === "edit" && listing ? (
        <input type="hidden" name="id" value={listing.id} />
      ) : null}

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold">Listing type</h2>
          <p className="text-xs text-muted-foreground">
            We defaulted this from your profile role. You can change it for this
            listing.
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
                onClick={() =>
                  setV((prev) => ({ ...prev, type: item.value }))
                }
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

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold">Listing details</h2>

        <FormField id="title" label="Title" error={errors.title}>
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
          hint="Describe the goods, requirements, and any important terms."
        >
          <textarea
            id="description"
            name="description"
            value={v.description}
            onChange={update("description")}
            rows={5}
            placeholder="Add the details a buyer or supplier needs to respond."
            aria-invalid={Boolean(errors.description)}
            className={textareaClass}
          />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="category" label="Category" error={errors.category}>
            <Select
              value={v.category}
              onValueChange={(value) =>
                setV((prev) => ({ ...prev, category: String(value ?? "") }))
              }
            >
              <SelectTrigger id="category" className="w-full">
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

          <FormField id="location" label="Location" error={errors.location}>
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
            hint="How long the listing should stay live once approved."
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

      {wanted ? (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold">Buyer requirements</h2>
            <p className="text-xs text-muted-foreground">
              These help suppliers decide whether they can fulfil your request.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="qualityStandard"
              label="Quality standard"
              error={errors.qualityStandard}
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
            hint="Paste a link to a PDF or document. File uploads are not wired yet."
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
        </section>
      ) : (
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-sm font-semibold">Seller details</h2>
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
              rows={4}
              placeholder="Packaging, certifications, dimensions, or other specs."
              aria-invalid={Boolean(errors.technicalSpecs)}
              className={textareaClass}
            />
          </FormField>

          <FormField
            id="images"
            label="Image URLs"
            error={errors.images}
            optional
            hint="One image URL per line, up to 6. File uploads are not wired yet."
          >
            <textarea
              id="images"
              name="images"
              value={v.images}
              onChange={update("images")}
              rows={4}
              placeholder={"https://example.com/photo-1.jpg\nhttps://example.com/photo-2.jpg"}
              aria-invalid={Boolean(errors.images)}
              className={textareaClass}
            />
          </FormField>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
        <p className="text-xs text-muted-foreground">
          New and edited listings are reviewed by an admin before going live.
        </p>
        <div className="flex items-center gap-2">
          <Button
            render={<Link href={basePath} />}
            variant="outline"
            nativeButton={false}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : mode === "create"
                ? "Submit listing"
                : "Save changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
