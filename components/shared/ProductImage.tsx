"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export interface ProductImageProps {
  src?: string;
  alt: string;
  fallbackLabel: string;
}

export function ProductImage({ src, alt, fallbackLabel }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-muted text-muted-foreground">
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        <span className="sr-only">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-300 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

