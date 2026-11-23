import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { seedListings } from "../scripts/_seed_listings";

function resolveSchema(): string {
  if (process.env.DATABASE_SCHEMA) return process.env.DATABASE_SCHEMA;
  try {
    return (
      new URL(process.env.DATABASE_URL || "").searchParams.get("schema") ||
      "public"
    );
  } catch {
    return "public";
  }
}

const adapter = new PrismaPg(process.env.DATABASE_URL || "", {
  schema: resolveSchema(),
});
const prisma = new PrismaClient({ adapter });

type DummyUser = {
  name: string;
  email: string;
  role: string;
  banned: boolean;
  banReason?: string;
  companyName: string;
  country: string;
  industry: string;
  companySize: string;
  phone?: string;
  website?: string;
};

const dummyUsers: DummyUser[] = [
  {
    name: "Alice Admin",
    email: "alice.admin@example.com",
    role: "admin",
    banned: false,
    companyName: "TradeHub HQ",
    country: "US",
    industry: "electronics",
    companySize: "51-200",
    phone: "+1 216 555 0100",
    website: "https://globaltradehub.example",
  },
  {
    name: "Super Sam",
    email: "sam.super@example.com",
    role: "superadmin",
    banned: false,
    companyName: "TradeHub HQ",
    country: "US",
    industry: "electronics",
    companySize: "51-200",
  },
  {
    name: "Bob Buyer",
    email: "bob.buyer@example.com",
    role: "buyer",
    banned: false,
    companyName: "Bob Co",
    country: "DE",
    industry: "machinery",
    companySize: "11-50",
    phone: "+49 40 555 0101",
  },
  {
    name: "Sara Supplier",
    email: "sara.supplier@example.com",
    role: "supplier",
    banned: false,
    companyName: "Sara Goods",
    country: "CN",
    industry: "textiles",
    companySize: "201-500",
    phone: "+86 21 555 0102",
  },
  {
    name: "Charlie TSP",
    email: "charlie.tsp@example.com",
    role: "trade-service-provider",
    banned: false,
    companyName: "Charlie Logistics",
    country: "IN",
    industry: "automotive",
    companySize: "1-10",
    phone: "+91 22 555 0103",
  },
  {
    name: "Diana Buyer",
    email: "diana.buyer@example.com",
    role: "buyer",
    banned: true,
    banReason: "Spam / abuse",
    companyName: "Diana Imports",
    country: "FR",
    industry: "agriculture",
    companySize: "1-10",
  },
  {
    name: "Evan Supplier",
    email: "evan.supplier@example.com",
    role: "supplier",
    banned: false,
    companyName: "Evan Exports",
    country: "BR",
    industry: "agriculture",
    companySize: "500+",
    phone: "+55 11 555 0104",
  },
  {
    name: "Fiona Buyer",
    email: "fiona.buyer@example.com",
    role: "buyer",
    banned: false,
    companyName: "Fiona Trading",
    country: "UK",
    industry: "other",
    companySize: "11-50",
    phone: "+44 20 555 0105",
  },
  {
    name: "Alex Rivera",
    email: "alex.apex@example.com",
    role: "supplier",
    banned: false,
    companyName: "Apex Industrial",
    country: "US",
    industry: "machinery",
    companySize: "51-200",
    phone: "+1 216 555 0199",
    website: "https://apexindustrial.example",
  },
];

async function seedUsers() {
  for (const user of dummyUsers) {
    const id = "seed_" + user.email.split("@")[0].replace(/[^a-z0-9]/gi, "_");
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });
    const data = { ...user, emailVerified: true };
    if (existing) {
      await prisma.user.update({ where: { email: user.email }, data });
    } else {
      await prisma.user.create({ data: { id, ...data } });
    }
  }
  console.log(`Seeded ${dummyUsers.length} users.`);
}

async function main() {
  await seedUsers();
  await seedListings(prisma);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
