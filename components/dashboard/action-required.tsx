import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

const actions = [
  {
    icon: Clock,
    title: "Closing Soon",
    description: "In 2 hours - RFQ #12345 closing",
    urgency: "urgent",
  },
  {
    icon: AlertTriangle,
    title: "Listing Expiring",
    description: "In 1 day - Industrial Aluminum Ingots",
    urgency: "warning",
  },
  {
    icon: RefreshCw,
    title: "Membership Renewal",
    description: "In 5 days - Enterprise Plan",
    urgency: "info",
  },
];

export function ActionRequired() {
  return (
    <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-4 w-4" />
          </div>
          Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <action.icon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">
                {action.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {action.description}
              </p>
            </div>
            <Badge
              variant={
                action.urgency === "urgent"
                  ? "destructive"
                  : action.urgency === "warning"
                    ? "secondary"
                    : "outline"
              }
              className={`text-xs ${action.urgency === "urgent" ? "animate-pulse" : ""}`}
            >
              {action.urgency}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

