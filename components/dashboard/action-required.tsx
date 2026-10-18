import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

const actions = [
  {
    icon: Clock,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    title: "Closing Soon",
    description: "In 2 hours - RFQ #12345 closing",
    urgency: "urgent",
  },
  {
    icon: AlertTriangle,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    title: "Listing Expiring",
    description: "In 1 day - Industrial Aluminum Ingots",
    urgency: "warning",
  },
  {
    icon: RefreshCw,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    title: "Membership Renewal",
    description: "In 5 days - Enterprise Plan",
    urgency: "info",
  },
];

export function ActionRequired() {
  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <AlertTriangle className="h-5 w-5" />
          Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-white border border-orange-100"
          >
            <div className={`p-2 rounded-full ${action.bgColor} ${action.iconColor}`}>
              <action.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{action.title}</p>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
            <Badge
              variant={
                action.urgency === "urgent"
                  ? "destructive"
                  : action.urgency === "warning"
                    ? "secondary"
                    : "outline"
              }
              className="text-xs"
            >
              {action.urgency}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
