import { requireAdmin } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";

export default async function CategoriesAdminPage() {
  await requireAdmin();

  const rawCategories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  const rawIndustries = await prisma.industry.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Taxonomy</h2>
        <p className="text-sm text-muted-foreground">
          Manage categories and industries. Renaming a category updates labels
          across the storefront without redeploying.
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Categories</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Active</th>
                <th className="px-2 py-2">Parent</th>
              </tr>
            </thead>
            <tbody>
              {rawCategories.map((category) => (
                <tr key={category.id} className="border-b last:border-0">
                  <td className="px-2 py-2 font-mono text-xs">{category.slug}</td>
                  <td className="px-2 py-2">{category.name}</td>
                  <td className="px-2 py-2">{category.sortOrder}</td>
                  <td className="px-2 py-2">
                    {category.active ? "Yes" : "No"}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">
                    {category.parentId ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {rawCategories.length} categories.
        </p>
      </section>

      <section className="rounded-2xl border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Industries</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {rawIndustries.map((industry) => (
                <tr key={industry.id} className="border-b last:border-0">
                  <td className="px-2 py-2 font-mono text-xs">{industry.slug}</td>
                  <td className="px-2 py-2">{industry.name}</td>
                  <td className="px-2 py-2">{industry.sortOrder}</td>
                  <td className="px-2 py-2">
                    {industry.active ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {rawIndustries.length} industries.
        </p>
      </section>
    </div>
  );
}
