import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Users } from "lucide-react";

const teamMembers = [
  { name: "JD", initials: "JD" },
  { name: "AS", initials: "AS" },
  { name: "MK", initials: "MK" },
  { name: "+5", initials: "+5" },
];

export function CompanyProfileSummary() {
  return (
    <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Company Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pb-6">
        {/* Company Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              AI
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-foreground">
              Apex Industrial
            </h3>
            <Badge
              variant="secondary"
              className="mt-2 bg-primary/10 text-primary border-primary/20"
            >
              Enterprise Plan
            </Badge>
          </div>
        </div>

        {/* Verified Status */}
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600 font-medium">Verified Seller</span>
        </div>

        {/* Profile Completion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium text-foreground">85%</span>
          </div>
          <Progress value={85} className="h-2" />
        </div>

        {/* Team Management */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Team Members
              </span>
            </div>
            <Link
              href="/settings/team"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Manage
            </Link>
          </div>
          <div className="flex -space-x-2">
            {teamMembers.map((member, index) => (
              <Avatar
                key={index}
                className="h-8 w-8 border-2 border-card cursor-pointer hover:z-10 hover:-translate-y-0.5 transition-transform"
              >
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

