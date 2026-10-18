import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MessageSquare, CheckCircle } from "lucide-react";

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-2">
      {/* Active Listings */}
      <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Listings
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-3xl font-extrabold text-foreground leading-tight">
            24
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Products listed for sale
          </p>
          <Badge
            variant="secondary"
            className="mt-4 bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
          >
            +12% this month
          </Badge>
        </CardContent>
      </Card>

      {/* Active Deals */}
      <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Deals
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-3xl font-extrabold text-foreground leading-tight">
            18
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Negotiations in progress
          </p>
          <Badge
            variant="secondary"
            className="mt-4 bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200"
          >
            +5% this week
          </Badge>
        </CardContent>
      </Card>

      {/* New Inquiries */}
      <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Inquiries
          </CardTitle>
          <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
            <MessageSquare className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-3xl font-extrabold text-foreground leading-tight">
            12
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Unread buyer messages
          </p>
          <Badge variant="destructive" className="mt-4 animate-pulse">
            Needs attention
          </Badge>
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile Completion
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="text-3xl font-extrabold text-foreground leading-tight">
            85%
          </div>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Complete your profile to get verified
          </p>
          <Progress value={85} className="mt-4 h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
