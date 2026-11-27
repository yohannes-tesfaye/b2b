"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LISTING_LIMITS } from "@/lib/validation/listing";
import { FormField } from "./form-field";

const MAX_DIMENSION = 1200;
const OUTPUT_QUALITY = 0.82;

/** Resize an image file to a JPEG data URL so it can live in `Listing.images`. */
async function fileToResizedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("decode-failed"));
    element.src = dataUrl;
  });

  const longest = Math.max(image.width, image.height);
  const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", OUTPUT_QUALITY);
}

function lines(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Listing image picker. Supports BOTH:
 *   - uploading local image files (resized, stored as data URLs), and
 *   - adding image links (http/https URLs).
 * Keeps `value` as the newline-joined `images` string the form + schema use.
 */
export function ListingImageInput({
  value,
  error,
  onChange,
  onTouch,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onTouch: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const images = lines(value);
  const full = images.length >= LISTING_LIMITS.maxImages;

  const commit = (next: string[]) => {
    onChange(next.join("\n"));
    onTouch();
  };

  const addLink = () => {
    const url = link.trim();
    if (!url) return;
    if (!/^https?:\/\/\S+$/i.test(url)) {
      setLinkError("Enter a valid URL starting with http:// or https://.");
      return;
    }
    if (full) {
      setLinkError(`Add up to ${LISTING_LIMITS.maxImages} images.`);
      return;
    }
    setLinkError(null);
    setLink("");
    commit([...images, url]);
  };

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const next = [...images];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        if (next.length >= LISTING_LIMITS.maxImages) break;
        next.push(await fileToResizedDataUrl(file));
      }
      setLinkError(null);
      commit(next);
    } catch {
      setLinkError("Could not read that image. Try another file.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <FormField
      id="images"
      label="Images"
      error={error}
      hint={`Upload up to ${LISTING_LIMITS.maxImages} images or paste image links.`}
      optional
    >
      <div className="flex flex-col gap-3">
        {images.length ? (
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {images.map((image, index) => (
              <li
                key={`${index}-${image.length}`}
                className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => commit(images.filter((_, i) => i !== index))}
                  className="absolute right-1 top-1 rounded-full bg-background/90 p-1 shadow transition-colors hover:bg-background"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
                <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-background/80 px-1 text-[10px] font-medium text-muted-foreground">
                  {image.startsWith("data:") ? "Uploaded" : "Link"}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => addFiles(event.target.files)}
        />
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy || full}
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus />
            {busy ? "Processing…" : "Upload images"}
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">
            {LISTING_LIMITS.maxImages} max, images are resized automatically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link2 className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            value={link}
            placeholder="https://example.com/photo.jpg"
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
            className="flex-1"
            onChange={(event) => {
              setLink(event.target.value);
              if (linkError) setLinkError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addLink();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addLink}
            disabled={!link.trim() || full}
          >
            Add link
          </Button>
        </div>
        {linkError ? (
          <p role="alert" className="text-xs text-destructive">
            {linkError}
          </p>
        ) : null}
      </div>
    </FormField>
  );
}
