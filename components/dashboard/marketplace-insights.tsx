import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    title: "Trending Sector",
    value: "Base Metals & Alloys",
    change: "+15.3%",
    changeColor: "text-green-600",
  },
  {
    icon: TrendingUp,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    title: "High Demand",
    value: "Industrial Aluminum Ingots",
    change: "+8.7%",
    changeColor: "text-green-600",
  },
  {
    icon: DollarSign,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    title: "Price Index",
    value: "Scrap Steel",
    change: "+2.5%",
    changeColor: "text-green-600",
  },
];

export function MarketplaceInsights() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Marketplace Insights</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div
                  className={`p-2 rounded-full ${insight.bgColor} ${insight.iconColor}`}
                >
                  <insight.icon className="h-4 w-4" />
                </div>
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-lg">{insight.value}</p>
              <Badge
                variant="outline"
                className={`mt-2 ${insight.changeColor}`}
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
