import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

export type ProductQuery = {
  type?: string;
  category?: string;
  q?: string;
  sort?: string;
  country?: string;
  industry?: string;
  tag?: string;
};

export function ProductPagination({
  page,
  totalPages,
  query,
}: {
  page: number;
  totalPages: number;
  query: ProductQuery;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const params = new URLSearchParams();
    if (query.type) params.set("type", query.type);
    if (query.category) params.set("category", query.category);
    if (query.q) params.set("q", query.q);
    if (query.sort) params.set("sort", query.sort);
    if (query.country) params.set("country", query.country);
    if (query.industry) params.set("industry", query.industry);
    if (query.tag) params.set("tag", query.tag);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  const items = pageItems(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 border-t pt-4 sm:justify-center sm:gap-3"
    >
      {page === 1 ? (
        <Button
          variant="outline"
          className="h-10 rounded-xl px-3"
          disabled
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Previous</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="h-10 rounded-xl px-3"
          render={<Link href={href(page - 1)} />}
          nativeButton={false}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Previous</span>
        </Button>
      )}

      <span className="text-xs font-medium text-muted-foreground sm:hidden">
        Page {page} of {totalPages}
      </span>

      <ul className="hidden items-center gap-1 sm:flex">
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item === "ellipsis" ? (
              <span
                aria-hidden
                className="flex h-10 w-8 items-center justify-center text-sm text-muted-foreground"
              >
                …
              </span>
            ) : item === page ? (
              <Button
                size="icon"
                className="h-10 w-10 rounded-xl"
                aria-current="page"
              >
                {item}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-10 w-10 rounded-xl")}
                render={<Link href={href(item)} />}
                nativeButton={false}
                aria-label={`Go to page ${item}`}
              >
                {item}
              </Button>
            )}
          </li>
        ))}
      </ul>

      {page === totalPages ? (
        <Button
          variant="outline"
          className="h-10 rounded-xl px-3"
          disabled
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          className="h-10 rounded-xl px-3"
          render={<Link href={href(page + 1)} />}
          nativeButton={false}
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
}

function pageItems(page: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, page - 1, page, page + 1]);
  if (page <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }
  if (page >= total - 2) {
    pages.add(total - 1);
    pages.add(total - 2);
    pages.add(total - 3);
  }

  const sorted = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(p);
  });
  return result;
}
