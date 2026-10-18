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
    <Card className="border-border/50 bg-card hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold">
          Communications & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
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
              <Link key={message.id} href="/messages">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {message.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">
                      {message.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
                      {message.preview}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {message.time}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <Link
              href="/messages"
              className="block text-center text-sm text-primary hover:text-primary/80 transition-colors mt-2"
            >
              View All Messages
            </Link>
          </TabsContent>
          <TabsContent value="alerts" className="space-y-3 mt-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {alert.title}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {alert.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2">
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
