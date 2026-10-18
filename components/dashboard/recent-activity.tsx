import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageSquare, FileCheck } from "lucide-react";

const activities = [
  {
    icon: CheckCircle,
    iconColor: "text-green-600",
    title: "Order Accepted",
    description: "Your order for Industrial Aluminum Ingots has been accepted",
    time: "2 hours ago",
  },
  {
    icon: MessageSquare,
    iconColor: "text-blue-600",
    title: "New Message",
    description: "You received a message from Apex Industrial",
    time: "5 hours ago",
  },
  {
    icon: FileCheck,
    iconColor: "text-purple-600",
    title: "Listing Approved",
    description: "Your surplus listing for Scrap Steel has been approved",
    time: "Yesterday",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Link href="/activity">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
            <div className={`p-2 rounded-full bg-muted ${activity.iconColor}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
