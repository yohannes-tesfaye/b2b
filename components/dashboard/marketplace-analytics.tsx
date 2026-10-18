import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Target, TrendingUp } from "lucide-react";

export function MarketplaceAnalytics() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Chart - Marketplace Visibility */}
      <Card className="lg:col-span-2 border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
            Marketplace Visibility
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Views vs. Inquiries - Last 30 Days
          </p>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="h-[300px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/50">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-primary/50 mb-3" />
              <p className="text-sm font-medium text-foreground">
                Marketplace Visibility Analytics
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Product views vs. buyer inquiries (30 days)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column Stack - Asymmetrical */}
      <div className="space-y-6">
        {/* Lead Generation - Taller */}
        <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Target className="h-4 w-4" />
              </div>
              Lead Generation
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[140px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/50">
              <div className="text-center">
                <Target className="h-8 w-8 mx-auto text-primary/50 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Lead Generation
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Qualified leads this week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Rate - Shorter */}
        <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-[100px] flex items-center justify-center bg-muted/30 rounded-lg border border-border/50">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-primary/50 mb-2" />
                <p className="text-sm font-medium text-foreground">
                  Success Rate
                </p>
                <p className="text-xs text-muted-foreground mt-1">
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
