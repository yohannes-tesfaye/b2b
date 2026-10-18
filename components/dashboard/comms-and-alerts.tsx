import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, MessageSquare } from "lucide-react";

const messages = [
  {
    id: "1",
    name: "John Smith",
    avatar: "JS",
    preview: "Hi, I'm interested in your aluminum ingots listing...",
    time: "2 min ago",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "SJ",
    preview: "Can you provide more details about the scrap steel?",
    time: "1 hour ago",
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "MC",
    preview: "I'd like to discuss bulk pricing for copper wire",
    time: "3 hours ago",
  },
];

const alerts = [
  {
    id: "1",
    title: "Price Alert",
    description: "Scrap Steel price increased by 2.5%",
    time: "10 min ago",
  },
  {
    id: "2",
    title: "New Listing Match",
    description: "New listing matches your saved search criteria",
    time: "1 hour ago",
  },
];

export function CommsAndAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Communications & Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="messages">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="messages" className="space-y-3 mt-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar>
                  <AvatarFallback>{message.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{message.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {message.preview}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
            <Link
              href="/messages"
              className="block text-center text-sm text-blue-600 hover:underline mt-2"
            >
              View All Messages
            </Link>
          </TabsContent>
          <TabsContent value="alerts" className="space-y-3 mt-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100"
              >
                <Bell className="h-4 w-4 text-orange-600 mt-1" />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {alert.time}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
