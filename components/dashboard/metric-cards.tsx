import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, MessageSquare, CheckCircle } from "lucide-react";

export function   MetricCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Active Listings */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-border/40 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Listings
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">24</div>
          <p className="text-xs text-muted-foreground mt-1">
            Products listed for sale
          </p>
          <Badge
            variant="secondary"
            className="mt-2 bg-green-100 text-green-700 hover:bg-green-100"
          >
            +12% this month
          </Badge>
        </CardContent>
      </Card>

      {/* Active Sales */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-border/40 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Deals
          </CardTitle>
          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">18</div>
          <p className="text-xs text-muted-foreground mt-1">
            Negotiations in progress
          </p>
          <Badge
            variant="secondary"
            className="mt-2 bg-purple-100 text-purple-700 hover:bg-purple-100"
          >
            +5% this week
          </Badge>
        </CardContent>
      </Card>

      {/* New Messages */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-border/40 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            New Inquiries
          </CardTitle>
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <MessageSquare className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">12</div>
          <p className="text-xs text-muted-foreground mt-1">
            Unread buyer messages
          </p>
          <Badge variant="destructive" className="mt-2 animate-pulse">
            Needs attention
          </Badge>
        </CardContent>
      </Card>

      {/* Profile Completion */}
      <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 border-border/40 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Profile Completion
          </CardTitle>
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">85%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Complete your profile to get verified
          </p>
          <Progress value={85} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
