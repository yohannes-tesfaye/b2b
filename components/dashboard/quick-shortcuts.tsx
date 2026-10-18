import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Search, FileText, DollarSign, Settings } from "lucide-react";

const shortcuts = [
  {
    icon: Package,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    title: "Available Listings",
    href: "/listings",
  },
  {
    icon: Search,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    title: "Wanted Requests",
    href: "/wanted",
  },
  {
    icon: FileText,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100",
    title: "Manage RFQs",
    href: "/rfq",
  },
  {
    icon: DollarSign,
    iconColor: "text-orange-600",
    bgColor: "bg-orange-100",
    title: "Invoices & Billing",
    href: "/billing",
  },
];

export function QuickShortcuts() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Quick Shortcuts</h2>
      <div className="grid grid-cols-2 gap-4">
        {shortcuts.map((shortcut, index) => (
          <Link key={index} href={shortcut.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2">
                <div className={`p-3 rounded-full ${shortcut.bgColor} ${shortcut.iconColor}`}>
                  <shortcut.icon className="h-6 w-6" />
                </div>
                <span className="font-medium text-sm">{shortcut.title}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Link href="/settings">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <Settings className="h-6 w-6" />
            </div>
            <span className="font-medium">Platform Settings</span>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
