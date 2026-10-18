import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Search, FileText, DollarSign, Settings } from "lucide-react";

const shortcuts = [
  {
    icon: Package,
    title: "Available Listings",
    href: "/listings",
  },
  {
    icon: Search,
    title: "Wanted Requests",
    href: "/wanted",
  },
  {
    icon: FileText,
    title: "Manage RFQs",
    href: "/rfq",
  },
  {
    icon: DollarSign,
    title: "Invoices & Billing",
    href: "/billing",
  },
];

export function QuickShortcuts() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Shortcuts</h2>
      <div className="grid grid-cols-2 gap-4">
        {shortcuts.map((shortcut, index) => (
          <Link key={index} href={shortcut.href}>
            <Card className="border-border/50 bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-primary/50 transition-all duration-200 cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <shortcut.icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm text-foreground">
                  {shortcut.title}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Link href="/settings">
        <Card className="border-border/50 bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-primary/50 transition-all duration-200 cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Settings className="h-6 w-6" />
            </div>
            <span className="font-medium text-sm text-foreground">
              Platform Settings
            </span>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
