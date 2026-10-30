"use client";

import Link from "next/link";
import { usePathname } from "@/i18n/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const seg of segments) {
    acc += "/" + seg;
    crumbs.push({ label: seg, href: acc });
  }
  if (crumbs.length === 0) crumbs.push({ label: "Dashboard", href: "/dashboard" });
  const items = crumbs.map((c, i) => {
    const prev = i > 0 ? crumbs[i - 1].label : "";
    const isId = c.label.length > 20 || (prev.toLowerCase() === "users" && i === crumbs.length - 1);
    const label = isId ? "Details" : c.label.charAt(0).toUpperCase() + c.label.slice(1).replace(/-/g, " ");
    return { ...c, label, isLast: i === crumbs.length - 1 };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((c, i) => (
          <span key={c.href} className="contents">
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {c.isLast ? (
                <BreadcrumbPage>{c.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={c.href} />}>{c.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
