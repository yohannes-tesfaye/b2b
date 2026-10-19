import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    title: "Trending Sector",
    value: "Base Metals & Alloys",
    change: "+15.3%",
  },
  {
    icon: TrendingUp,
    title: "High Demand",
    value: "Industrial Aluminum Ingots",
    change: "+8.7%",
  },
  {
    icon: DollarSign,
    title: "Price Index",
    value: "Scrap Steel",
    change: "+2.5%",
  },
];

export function MarketplaceInsights() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Marketplace Insights
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card
            key={index}
            className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <insight.icon className="h-3 w-3" />
                </div>
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <p className="font-semibold text-base text-foreground leading-relaxed">
                {insight.value}
              </p>
              <Badge
                variant="secondary"
                className="mt-3 bg-green-100 text-green-700 border-green-200"
              >
                {insight.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
