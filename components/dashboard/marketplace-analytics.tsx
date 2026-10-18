import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, TrendingUp } from "lucide-react";

export function MarketplaceAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart - Marketplace Visibility */}
      <Card className="lg:col-span-2 transition-all duration-200 hover:shadow-lg border-border/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            Marketplace Visibility
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Views vs. Inquiries - Last 30 Days
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-blue-400 mb-2" />
              <p className="text-sm font-medium text-blue-600">
                Marketplace Visibility Analytics
              </p>
              <p className="text-xs text-muted-foreground">
                Product views vs. buyer inquiries (30 days)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column Stack */}
      <div className="space-y-6">
        {/* Lead Generation */}
        <Card className="transition-all duration-200 hover:shadow-lg border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Target className="h-4 w-4" />
              </div>
              Lead Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[120px] flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto text-green-500 mb-1" />
                <p className="text-xs font-medium text-green-700">
                  Lead Generation
                </p>
                <p className="text-xs text-muted-foreground">
                  Qualified leads this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className="transition-all duration-200 hover:shadow-lg border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <TrendingUp className="h-4 w-4" />
              </div>
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[120px] flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-100">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-purple-500 mb-1" />
                <p className="text-xs font-medium text-purple-700">
                  Success Rate
                </p>
                <p className="text-xs text-muted-foreground">
                  Deal closure percentage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
