import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const listings = [
  {
    id: "1",
    title: "Industrial Aluminum Ingots",
    type: "FOR SALE",
    typeColor: "bg-green-600",
    status: "2d left",
    statusColor: "text-orange-600",
    price: "$2,500/ton",
    image:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Scrap Steel - Grade A",
    type: "WANTED",
    typeColor: "bg-blue-600",
    status: "Urgent",
    statusColor: "text-red-600",
    price: "$1,800/ton",
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Copper Wire Scrap",
    type: "FOR SALE",
    typeColor: "bg-green-600",
    status: "New",
    statusColor: "text-green-600",
    price: "$8,500/ton",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    title: "Brass Ingots",
    type: "FOR SALE",
    typeColor: "bg-green-600",
    status: "3d left",
    statusColor: "text-orange-600",
    price: "$4,200/ton",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
  },
];

export function RecommendedListings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recommended for You</h2>
        <Link
          href="/marketplace"
          className="text-sm text-blue-600 hover:underline"
        >
          Browse Marketplace
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/marketplace/listing/${listing.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
                <Badge
                  className={`absolute top-2 right-2 ${listing.typeColor} text-white text-xs`}
                >
                  {listing.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${listing.statusColor}`}
                  >
                    {listing.status}
                  </Badge>
                  <span className="text-sm font-semibold">{listing.price}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
