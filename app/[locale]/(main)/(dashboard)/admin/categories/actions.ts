"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/dashboard-access";

function slugifyName(value: string) {
  const s = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || `item-${Date.now()}`;
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const slug = slugifyName(name);
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  const parentId = String(formData.get("parentId") ?? "").trim() || null;
  await prisma.category.create({
    data: { name, slug, sortOrder, parentId, active: true },
  });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function renameCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await prisma.category.update({ where: { id }, data: { name } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function toggleCategoryActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const cat = await prisma.category.findUnique({ where: { id }, select: { active: true } });
  if (!cat) return;
  await prisma.category.update({ where: { id }, data: { active: !cat.active } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function updateCategoryOrder(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  if (!id) return;
  await prisma.category.update({ where: { id }, data: { sortOrder } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function createIndustry(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const slug = slugifyName(name);
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;
  await prisma.industry.create({
    data: { name, slug, sortOrder, active: true },
  });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function renameIndustry(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await prisma.industry.update({ where: { id }, data: { name } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function toggleIndustryActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const ind = await prisma.industry.findUnique({ where: { id }, select: { active: true } });
  if (!ind) return;
  await prisma.industry.update({ where: { id }, data: { active: !ind.active } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function deleteTag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const inUse = await prisma.listingTag.count({ where: { tagId: id } });
  if (inUse > 0) return;
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/[locale]/admin/categories", "page");
}

export async function renameTag(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  const slug = slugifyName(name);
  await prisma.tag.update({ where: { id }, data: { name, slug } });
  revalidatePath("/[locale]/admin/categories", "page");
}
