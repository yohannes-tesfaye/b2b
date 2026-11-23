import "dotenv/config";
import type { PrismaClient } from "@prisma/client";

const now = new Date();
const addDays = (days: number, from = now) =>
  new Date(from.getTime() + days * 86400000);
const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 3600000);
const daysAgo = (days: number) => addDays(-days);

const IMAGES = {
  coffee: [
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80",
  ],
  tires: [
    "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&auto=format&fit=crop&q=80",
  ],
  cotton: [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80",
  ],
  machinery: [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&auto=format&fit=crop&q=80",
  ],
  tractor: [
    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&auto=format&fit=crop&q=80",
  ],
  freight: [
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11af0c31dd?w=800&auto=format&fit=crop&q=80",
  ],
  steel: [
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&auto=format&fit=crop&q=80",
  ],
  lubricant: [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
  ],
  copper: [
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
  ],
  sesame: [
    "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800&auto=format&fit=crop&q=80",
  ],
  honey: [
    "https://images.unsplash.com/photo-1587049352846-4a367e3f1a0e?w=800&auto=format&fit=crop&q=80",
  ],
};

const ADMIN_ID = "seed_alice_admin";
const APEX_ID = "seed_alex_apex";

type SeedListing = {
  userId: string;
  type: "wanted" | "available";
  title: string;
  description: string;
  category: string;
  quantity: string;
  location: string;
  durationDays: number;
  status: "pending" | "active" | "rejected" | "closed";
  expiresAt: Date;
  createdAt: Date;
  views: number;
  inquiries: number;
  qualityStandard?: string;
  deliveryTimeline?: string;
  preferredRegion?: string;
  budgetRange?: string;
  technicalDocument?: string;
  images?: string[];
  price?: string;
  currency?: string;
  moq?: string;
  certifications?: string;
  incoterms?: string;
  originCountry?: string;
  deliveryOptions?: string;
  technicalSpecs?: string;
  rejectionReason?: string;
  moderationNotes?: string;
};

const listings: SeedListing[] = [
  {
    userId: "seed_bob_buyer",
    type: "wanted",
    title: "Industrial Grade Coffee Beans - Arabica",
    description:
      "Seeking a reliable supplier of premium Arabica coffee beans for our roastery. Need consistent quality, moisture content under 12%, and SCA score 84+. Long-term contract preferred.",
    category: "food-beverage",
    quantity: "5000 kg",
    location: "Hamburg, Germany",
    durationDays: 60,
    qualityStandard: "SCA 84+, moisture <12%, screen size 15+",
    deliveryTimeline: "Within 30 days of order",
    preferredRegion: "East Africa, Central America",
    budgetRange: "$4.50 - $6.00 per kg",
    images: IMAGES.coffee,
    status: "active",
    expiresAt: addDays(60),
    createdAt: daysAgo(12),
    views: 186,
    inquiries: 9,
  },
  {
    userId: "seed_diana_buyer",
    type: "wanted",
    title: "Heavy Duty Truck Tires (315/80R22.5)",
    description:
      "Looking for bulk supply of heavy-duty radial truck tires suitable for long-haul freight. Must meet ECE R54 and DOT standards.",
    category: "automotive",
    quantity: "200 units",
    location: "Paris, France",
    durationDays: 45,
    qualityStandard: "ECE R54, DOT, tread depth 18mm+",
    deliveryTimeline: "Within 45 days",
    preferredRegion: "Asia, Europe",
    budgetRange: "$180 - $260 per tire",
    images: IMAGES.tires,
    status: "pending",
    expiresAt: addDays(45),
    createdAt: hoursAgo(8),
    views: 12,
    inquiries: 0,
  },
  {
    userId: "seed_fiona_buyer",
    type: "wanted",
    title: "Organic Cotton Fabric (GOTS Certified)",
    description:
      "Sourcing GOTS-certified organic cotton fabric for apparel manufacturing. Need 150gsm jersey and 200gsm twill variants.",
    category: "textiles",
    quantity: "10000 meters",
    location: "London, UK",
    durationDays: 90,
    qualityStandard: "GOTS certified, OEKO-TEX Standard 100",
    deliveryTimeline: "Within 60 days",
    preferredRegion: "India, Turkey, Bangladesh",
    budgetRange: "$3.00 - $4.50 per meter",
    images: IMAGES.cotton,
    status: "active",
    expiresAt: addDays(2),
    createdAt: daysAgo(88),
    views: 94,
    inquiries: 4,
  },
  {
    userId: "seed_bob_buyer",
    type: "wanted",
    title: "CNC Milling Machine (5-axis)",
    description:
      "Procuring a 5-axis CNC milling center for precision aerospace parts. Spindle speed 12000 RPM+, tool magazine 30+ tools.",
    category: "machinery",
    quantity: "1 unit",
    location: "Munich, Germany",
    durationDays: 120,
    qualityStandard: "ISO 9001, CE marked, positioning accuracy 0.005mm",
    deliveryTimeline: "Within 90 days",
    preferredRegion: "Germany, Japan, Taiwan",
    budgetRange: "$120,000 - $180,000",
    images: IMAGES.machinery,
    status: "rejected",
    rejectionReason: "Incomplete technical documentation for the requested machine class.",
    moderationNotes: "Ask the buyer to attach a spec sheet before resubmitting.",
    expiresAt: addDays(120),
    createdAt: daysAgo(6),
    views: 21,
    inquiries: 1,
  },
  {
    userId: "seed_sara_supplier",
    type: "available",
    title: "Premium Arabica Coffee Beans - Direct from Farm",
    description:
      "Freshly harvested Arabica beans from our estate in Yirgacheffe. Washed process, SCA 86. Available in 60kg jute bags. Export ready.",
    category: "food-beverage",
    quantity: "20000 kg",
    location: "Addis Ababa, Ethiopia",
    durationDays: 90,
    images: IMAGES.coffee,
    price: "5.20",
    currency: "USD",
    moq: "5 bags (300 kg)",
    certifications: "Organic, Fair Trade",
    incoterms: "FOB Djibouti",
    originCountry: "Ethiopia",
    deliveryOptions: "FOB Djibouti, CIF available on request",
    technicalSpecs: "Moisture 10.5%, screen 16+, density 0.72g/ml",
    status: "active",
    expiresAt: addDays(90),
    createdAt: daysAgo(20),
    views: 412,
    inquiries: 18,
  },
  {
    userId: "seed_evan_supplier",
    type: "available",
    title: "Agricultural Tractor Tires (18.4-38)",
    description:
      "New radial agricultural tires for tractors. Deep tread, puncture resistant, suitable for wet field conditions. OEM quality.",
    category: "agriculture",
    quantity: "500 units",
    location: "Sao Paulo, Brazil",
    durationDays: 60,
    images: IMAGES.tractor,
    price: "210",
    currency: "USD",
    moq: "20 units",
    certifications: "ISO 9001",
    incoterms: "FOB Santos",
    originCountry: "Brazil",
    deliveryOptions: "FOB Santos, container shipping available",
    technicalSpecs: "Load index 154, speed rating A8, tubeless",
    status: "active",
    expiresAt: addDays(60),
    createdAt: daysAgo(9),
    views: 77,
    inquiries: 3,
  },
  {
    userId: "seed_charlie_tsp",
    type: "available",
    title: "Freight Forwarding & Customs Clearance Services",
    description:
      "End-to-end freight forwarding covering sea, air, and road. Includes customs brokerage, warehousing, and last-mile delivery across India and neighboring regions.",
    category: "services",
    quantity: "Per shipment",
    location: "Mumbai, India",
    durationDays: 365,
    images: IMAGES.freight,
    price: "Quote on request",
    currency: "USD",
    moq: "1 shipment",
    certifications: "ISO 9001, licensed customs broker",
    incoterms: "DDP / DAP / FOB",
    originCountry: "India",
    deliveryOptions: "Door-to-door, port-to-port, DDP available",
    technicalSpecs: "Licensed customs broker, ISO 9001 certified",
    status: "active",
    expiresAt: addDays(365),
    createdAt: daysAgo(40),
    views: 230,
    inquiries: 11,
  },
  {
    userId: "seed_sara_supplier",
    type: "available",
    title: "Handwoven Organic Cotton Fabric",
    description:
      "GOTS-certified organic cotton fabric, handwoven. Available in jersey (150gsm) and twill (200gsm). Natural dyes available on request.",
    category: "textiles",
    quantity: "5000 meters",
    location: "Jaipur, India",
    durationDays: 90,
    images: IMAGES.cotton,
    price: "3.80",
    currency: "USD",
    moq: "500 meters",
    certifications: "GOTS, OEKO-TEX Standard 100",
    incoterms: "FOB Mumbai",
    originCountry: "India",
    deliveryOptions: "FOB Mumbai, air freight available",
    technicalSpecs: "Width 150cm, shrinkage <3%, color fastness 4-5",
    status: "active",
    expiresAt: addDays(90),
    createdAt: daysAgo(15),
    views: 155,
    inquiries: 7,
  },
  {
    userId: "seed_sara_supplier",
    type: "available",
    title: "Organic White Sesame Seeds — Humera Type",
    description:
      "Cleaned and sorted Humera-type white sesame for tahini and bakery export. Moisture under 6%, purity 99.9%. Packed in 50kg PP bags.",
    category: "agriculture",
    quantity: "80 MT",
    location: "Humera, Ethiopia",
    durationDays: 75,
    images: IMAGES.sesame,
    price: "1480",
    currency: "USD",
    moq: "1 container (20 MT)",
    certifications: "Organic, phytosanitary ready",
    incoterms: "FOB Djibouti",
    originCountry: "Ethiopia",
    deliveryOptions: "FOB Djibouti, CIF Mediterranean ports",
    technicalSpecs: "Oil content 48%+, admixture <0.5%",
    status: "pending",
    expiresAt: addDays(75),
    createdAt: hoursAgo(20),
    views: 8,
    inquiries: 0,
  },
  {
    userId: "seed_evan_supplier",
    type: "available",
    title: "Raw Forest Honey — Sidama Highlands",
    description:
      "Unprocessed multifloral honey from Sidama highlands. Suitable for bottling and bulk food manufacturing. Lab tested for moisture and HMF.",
    category: "food-beverage",
    quantity: "12 MT",
    location: "Hawassa, Ethiopia",
    durationDays: 45,
    images: IMAGES.honey,
    price: "3.40",
    currency: "USD",
    moq: "200 kg",
    certifications: "Organic pending, HACCP",
    incoterms: "EXW Hawassa",
    originCountry: "Ethiopia",
    deliveryOptions: "EXW Hawassa, FOB Djibouti",
    technicalSpecs: "Moisture <18%, HMF <40 mg/kg",
    status: "closed",
    expiresAt: addDays(-3),
    createdAt: daysAgo(50),
    views: 61,
    inquiries: 2,
  },
  {
    userId: APEX_ID,
    type: "wanted",
    title: "Scrap Steel Grade C - 500 MT",
    description:
      "Apex Industrial is sourcing Grade C scrap steel for foundry feedstock. Need consistent chemistry, low residual copper, and mill certificates with each lot.",
    category: "machinery",
    quantity: "500 MT",
    location: "Cleveland, USA",
    durationDays: 30,
    qualityStandard: "ISRI Grade C, residual Cu <0.4%",
    deliveryTimeline: "Staggered lots over 30 days",
    preferredRegion: "North America, EU",
    budgetRange: "$280 / MT",
    images: IMAGES.steel,
    status: "active",
    expiresAt: addDays(2),
    createdAt: daysAgo(28),
    views: 318,
    inquiries: 14,
  },
  {
    userId: APEX_ID,
    type: "available",
    title: "Industrial Lubricant Barrels (Lot of 50)",
    description:
      "Surplus ISO VG 68 industrial lubricant in sealed 200L drums. Suitable for heavy machinery. Lot of 50 drums available immediately from Cleveland warehouse.",
    category: "chemicals",
    quantity: "50 drums",
    location: "Cleveland, USA",
    durationDays: 21,
    images: IMAGES.lubricant,
    price: "15000",
    currency: "USD",
    moq: "Lot of 50",
    certifications: "ISO 6743, SDS available",
    incoterms: "EXW Cleveland",
    originCountry: "United States",
    deliveryOptions: "EXW Cleveland, FCA, domestic trucking",
    technicalSpecs: "ISO VG 68, flash point 220°C, 200L drums",
    status: "active",
    expiresAt: addDays(21),
    createdAt: hoursAgo(30),
    views: 44,
    inquiries: 2,
  },
  {
    userId: APEX_ID,
    type: "wanted",
    title: "Logistics Partner for EU Routes",
    description:
      "Looking for a 3PL / freight partner to handle weekly industrial shipments from the US Midwest to EU ports (Rotterdam, Hamburg, Antwerp). Need bonded warehousing optional.",
    category: "services",
    quantity: "Weekly FCL / LCL mix",
    location: "Cleveland, USA",
    durationDays: 14,
    qualityStandard: "Licensed NVOCC, cargo insurance included",
    deliveryTimeline: "First lane live within 14 days",
    preferredRegion: "EU, North America",
    budgetRange: "Open / quote requested",
    images: IMAGES.freight,
    status: "active",
    expiresAt: addDays(1),
    createdAt: daysAgo(4),
    views: 89,
    inquiries: 6,
  },
  {
    userId: APEX_ID,
    type: "available",
    title: "Copper Wire Spools 2.5mm",
    description:
      "Bare copper wire, 2.5mm, on industrial spools. Remaining inventory from a cancelled OEM contract. Mill test reports available.",
    category: "electronics",
    quantity: "8 MT",
    location: "Cleveland, USA",
    durationDays: 18,
    images: IMAGES.copper,
    price: "4.20",
    currency: "USD",
    moq: "500 kg",
    certifications: "ASTM B3, mill certs",
    incoterms: "FCA Cleveland",
    originCountry: "United States",
    deliveryOptions: "FCA Cleveland, domestic and export packing",
    technicalSpecs: "2.5mm bare copper, 99.9% Cu, 25kg spools",
    status: "active",
    expiresAt: addDays(5),
    createdAt: daysAgo(7),
    views: 203,
    inquiries: 8,
  },
  {
    userId: APEX_ID,
    type: "available",
    title: "Industrial Grade Copper Wire - Annual Contract",
    description:
      "Annual offtake available for 2.5mm copper wire. Preferred for repeat industrial buyers. Quote based on LME plus conversion.",
    category: "electronics",
    quantity: "120 MT / year",
    location: "Cleveland, USA",
    durationDays: 365,
    images: IMAGES.copper,
    price: "Quote on LME + conversion",
    currency: "USD",
    moq: "5 MT per call-off",
    certifications: "ASTM B3, ISO 9001",
    incoterms: "FCA Cleveland",
    originCountry: "United States",
    deliveryOptions: "Scheduled call-offs, export packing",
    technicalSpecs: "2.5mm, 99.9% Cu",
    status: "pending",
    expiresAt: addDays(365),
    createdAt: hoursAgo(5),
    views: 3,
    inquiries: 0,
  },
];

export async function seedListings(prisma: PrismaClient) {
  const seedUserIds = [
    ...new Set(listings.map((listing) => listing.userId)),
    ADMIN_ID,
  ];

  const existingUsers = await prisma.user.findMany({
    where: { id: { in: seedUserIds } },
    select: { id: true },
  });
  const existingIds = new Set(existingUsers.map((user) => user.id));
  const missingOwners = [...new Set(listings.map((listing) => listing.userId))].filter(
    (id) => !existingIds.has(id)
  );
  if (missingOwners.length) {
    throw new Error(
      `Cannot seed listings; missing users: ${missingOwners.join(", ")}. Run user seed first.`
    );
  }

  const deleted = await prisma.listing.deleteMany({
    where: { userId: { in: [...existingIds] } },
  });
  console.log("deleted seed listings:", deleted.count);

  for (const listing of listings) {
    const reviewed =
      listing.status === "pending"
        ? {}
        : {
            reviewedById: ADMIN_ID,
            reviewedAt: listing.createdAt,
          };

    const created = await prisma.listing.create({
      data: {
        userId: listing.userId,
        type: listing.type,
        title: listing.title,
        description: listing.description,
        category: listing.category,
        quantity: listing.quantity,
        location: listing.location,
        durationDays: listing.durationDays,
        status: listing.status,
        expiresAt: listing.expiresAt,
        createdAt: listing.createdAt,
        updatedAt: listing.createdAt,
        views: listing.views,
        inquiries: listing.inquiries,
        qualityStandard: listing.qualityStandard ?? "",
        deliveryTimeline: listing.deliveryTimeline ?? "",
        preferredRegion: listing.preferredRegion ?? "",
        budgetRange: listing.budgetRange ?? "",
        technicalDocument: listing.technicalDocument ?? "",
        images: listing.images ?? [],
        price: listing.price ?? "",
        currency: listing.currency ?? "",
        moq: listing.moq ?? "",
        certifications: listing.certifications ?? "",
        incoterms: listing.incoterms ?? "",
        originCountry: listing.originCountry ?? "",
        deliveryOptions: listing.deliveryOptions ?? "",
        technicalSpecs: listing.technicalSpecs ?? "",
        rejectionReason: listing.rejectionReason,
        moderationNotes: listing.moderationNotes,
        ...reviewed,
        statusHistory: {
          create: {
            fromStatus: null,
            toStatus: listing.status,
            reason:
              listing.status === "rejected"
                ? listing.rejectionReason
                : listing.status === "pending"
                  ? "Submitted for review"
                  : "Seeded marketplace listing",
            changedById: listing.status === "pending" ? listing.userId : ADMIN_ID,
            createdAt: listing.createdAt,
          },
        },
      },
    });
    void created;
  }

  console.log("inserted listings:", listings.length);
}

async function runStandalone() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");

  function resolveSchema() {
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
  try {
    await seedListings(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

const isDirectRun = process.argv[1]?.includes("_seed_listings");
if (isDirectRun) {
  runStandalone().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
