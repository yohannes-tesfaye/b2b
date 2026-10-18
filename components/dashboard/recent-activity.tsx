import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, FileCheck } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    title: "Order Accepted",
    description: "Your order for Industrial Aluminum Ingots has been accepted",
    time: "2 hours ago",
  },
  {
    icon: MessageSquare,
    title: "New Message",
    description: "You received a message from Apex Industrial",
    time: "5 hours ago",
  },
  {
    icon: FileCheck,
    title: "Listing Approved",
    description: "Your surplus listing for Scrap Steel has been approved",
    time: "Yesterday",
  },
];

export function RecentActivity() {
  return (
    <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <Link href="/activity">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10"
          >
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">
                {activity.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
