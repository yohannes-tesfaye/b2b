import { requireAdmin } from "@/lib/dashboard-access";
import { prisma } from "@/lib/prisma";
import {
  createCategory,
  renameCategory,
  toggleCategoryActive,
  updateCategoryOrder,
  createIndustry,
  renameIndustry,
  toggleIndustryActive,
  deleteTag,
  renameTag,
} from "./actions";

export default async function CategoriesAdminPage() {
  await requireAdmin();

  const [categories, industries, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.industry.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    prisma.tag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { listings: true } } },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Taxonomy</h2>
        <p className="text-sm text-muted-foreground">
          Manage categories, industries, and tags. Renaming a category updates
          labels across the storefront without redeploying.
        </p>
      </div>

      {/* Categories */}
      <section className="rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Categories</h3>
          <span className="text-xs text-muted-foreground">
            {categories.length} total
          </span>
        </div>

        <form
          action={createCategory}
          className="mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed p-3"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              name="name"
              required
              className="h-9 rounded-md border bg-background px-2 text-sm"
              placeholder="New category"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="h-9 w-20 rounded-md border bg-background px-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Parent</label>
            <select
              name="parentId"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">— none —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Add category
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Active</th>
                <th className="px-2 py-2">Parent</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b last:border-0">
                  <td className="px-2 py-2 font-mono text-xs">
                    {category.slug}
                  </td>
                  <td className="px-2 py-2">
                    <form action={renameCategory} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={category.id} />
                      <input
                        name="name"
                        defaultValue={category.name}
                        className="h-8 w-40 rounded-md border bg-background px-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="h-8 rounded-md border px-2 text-xs"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2">
                    <form action={updateCategoryOrder} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={category.id} />
                      <input
                        name="sortOrder"
                        type="number"
                        defaultValue={category.sortOrder}
                        className="h-8 w-16 rounded-md border bg-background px-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="h-8 rounded-md border px-2 text-xs"
                      >
                        Set
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2">
                    <form action={toggleCategoryActive}>
                      <input type="hidden" name="id" value={category.id} />
                      <button
                        type="submit"
                        className={`h-8 rounded-md border px-2 text-xs ${category.active ? "text-emerald-600" : "text-muted-foreground"}`}
                      >
                        {category.active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">
                    {category.parentId
                      ? categories.find((c) => c.id === category.parentId)?.name ??
                        category.parentId
                      : "—"}
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Industries */}
      <section className="rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Industries</h3>
          <span className="text-xs text-muted-foreground">
            {industries.length} total
          </span>
        </div>

        <form
          action={createIndustry}
          className="mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed p-3"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Name</label>
            <input
              name="name"
              required
              className="h-9 rounded-md border bg-background px-2 text-sm"
              placeholder="New industry"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Order</label>
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="h-9 w-20 rounded-md border bg-background px-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="h-9 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
          >
            Add industry
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Active</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {industries.map((industry) => (
                <tr key={industry.id} className="border-b last:border-0">
                  <td className="px-2 py-2 font-mono text-xs">
                    {industry.slug}
                  </td>
                  <td className="px-2 py-2">
                    <form action={renameIndustry} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={industry.id} />
                      <input
                        name="name"
                        defaultValue={industry.name}
                        className="h-8 w-40 rounded-md border bg-background px-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="h-8 rounded-md border px-2 text-xs"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2">{industry.sortOrder}</td>
                  <td className="px-2 py-2">
                    <form action={toggleIndustryActive}>
                      <input type="hidden" name="id" value={industry.id} />
                      <button
                        type="submit"
                        className={`h-8 rounded-md border px-2 text-xs ${industry.active ? "text-emerald-600" : "text-muted-foreground"}`}
                      >
                        {industry.active ? "Active" : "Inactive"}
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2 text-xs text-muted-foreground">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tags */}
      <section className="rounded-2xl border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tags</h3>
          <span className="text-xs text-muted-foreground">
            {tags.length} total · delete blocked when in use
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-2 py-2">Slug</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">In use</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b last:border-0">
                  <td className="px-2 py-2 font-mono text-xs">{tag.slug}</td>
                  <td className="px-2 py-2">
                    <form action={renameTag} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={tag.id} />
                      <input
                        name="name"
                        defaultValue={tag.name}
                        className="h-8 w-40 rounded-md border bg-background px-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="h-8 rounded-md border px-2 text-xs"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                  <td className="px-2 py-2 text-xs">{tag._count.listings}</td>
                  <td className="px-2 py-2">
                    <form action={deleteTag}>
                      <input type="hidden" name="id" value={tag.id} />
                      <button
                        type="submit"
                        disabled={tag._count.listings > 0}
                        className="h-8 rounded-md border px-2 text-xs text-destructive disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
