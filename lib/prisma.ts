import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function resolveSchema() {
  if (process.env.DATABASE_SCHEMA) return process.env.DATABASE_SCHEMA;
  try {
    return new URL(process.env.DATABASE_URL || "").searchParams.get("schema") || "public";
  } catch {
    return "public";
  }
}

const adapter = new PrismaPg(process.env.DATABASE_URL || "", { schema: resolveSchema() });

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
