"use client";

import { ChevronRight, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export type SpecItem = { label: string; value: string | null };

export function ProductSpecifications({
  specs,
  technicalSpecs,
  documentUrl,
  isWanted,
}: {
  specs: SpecItem[];
  technicalSpecs?: string | null;
  documentUrl?: string | null;
  isWanted: boolean;
}) {
  const filled = specs.filter((s) => s.value);
  const key = filled.slice(0, 6);
  const hasMore = filled.length > key.length || !!technicalSpecs || !!documentUrl;

  return (
    <>
      <div className="hidden lg:block">
        <SpecGrid items={filled} />
        {technicalSpecs ? <TechnicalSpecs text={technicalSpecs} /> : null}
        {documentUrl ? <DocumentLink href={documentUrl} /> : null}
      </div>

      <div className="lg:hidden">
        <SpecGrid items={key} />
        {hasMore ? (
          <Drawer>
            <DrawerTrigger
              render={
                <Button
                  variant="outline"
                  className="mt-3 h-11 w-full rounded-xl text-sm font-semibold"
                />
              }
            >
              View all specifications
              <ChevronRight className="h-4 w-4" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader className="flex flex-row items-start justify-between">
                <div>
                  <DrawerTitle>Specifications</DrawerTitle>
                  <DrawerDescription>
                    {isWanted
                      ? "Full buyer requirements for this request."
                      : "Full product details from the supplier."}
                  </DrawerDescription>
                </div>
                <DrawerClose
                  render={
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      className="h-11 w-11 rounded-full"
                      aria-label="Close specifications"
                    />
                  }
                >
                  <X className="h-4 w-4" />
                </DrawerClose>
              </DrawerHeader>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-4">
                <SpecGrid items={filled} />
                {technicalSpecs ? <TechnicalSpecs text={technicalSpecs} /> : null}
                {documentUrl ? <DocumentLink href={documentUrl} /> : null}
              </div>

              <DrawerFooter className="border-t pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <DrawerClose
                  render={
                    <Button className="h-11 w-full rounded-xl">Done</Button>
                  }
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        ) : null}
      </div>
    </>
  );
}

function SpecGrid({ items }: { items: SpecItem[] }) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No specifications were provided.
      </p>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-border/60 bg-muted/30 p-3 lg:rounded-none lg:border-0 lg:border-b lg:bg-transparent lg:px-0 lg:pb-2.5 lg:pt-0"
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground lg:text-[11px]">
            {item.label}
          </dt>
          <dd className="mt-0.5 break-words text-[13px] font-medium lg:text-sm">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TechnicalSpecs({ text }: { text: string }) {
  return (
    <div className="mt-4 rounded-xl bg-muted/50 p-4">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Technical specs
      </p>
      <p className="whitespace-pre-line text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function DocumentLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
    >
      <FileText className="h-4 w-4" /> Open technical document
    </a>
  );
}
