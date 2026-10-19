import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const listings = [
  {
    id: "1",
    title: "Industrial Aluminum Ingots",
    type: "FOR SALE",
    status: "2d left",
    price: "$2,500/ton",
    image:
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    title: "Scrap Steel - Grade A",
    type: "WANTED",
    status: "Urgent",
    price: "$1,800/ton",
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    title: "Copper Wire Scrap",
    type: "FOR SALE",
    status: "New",
    price: "$8,500/ton",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "4",
    title: "Brass Ingots",
    type: "FOR SALE",
    status: "3d left",
    price: "$4,200/ton",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80",
  },
];

export function RecommendedListings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Recommended for You
        </h2>
        <Link
          href="/marketplace"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/marketplace/listing/${listing.id}`}>
            <Card className="border-border/50 bg-card hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/50 transition-all duration-200 cursor-pointer">
              <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                />
                <Badge
                  className={`absolute top-2 right-2 ${listing.type === "WANTED" ? "bg-primary text-primary-foreground" : "bg-green-600 text-white"} text-xs`}
                >
                  {listing.type}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 leading-relaxed">
                  {listing.title}
                </h3>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${listing.status === "Urgent" ? "text-destructive border-destructive/50" : "text-muted-foreground"}`}
                  >
                    {listing.status}
                  </Badge>
                  <span className="text-sm font-semibold text-foreground">
                    {listing.price}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

