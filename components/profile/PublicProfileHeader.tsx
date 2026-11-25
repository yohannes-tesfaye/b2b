"use client";

import { useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  MessageCircle,
  Share2,
  ShieldCheck,
  MapPin,
  Building2,
  Globe2,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { initialsFrom } from "@/lib/profile";
import { countryName } from "@/lib/countries";
import { startChatWithSeller } from "@/utils/inquiries/actions";

interface PublicProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string | null;
    companyName: string | null;
    phone: string | null;
    website: string | null;
    country: string | null;
    industry: string | null;
    companySize: string | null;
    bio: string | null;
    verified: boolean;
    createdAt: Date | string;
  };
  isOwner: boolean;
  activeCount: number;
  totalCount: number;
}

export function PublicProfileHeader({
  user,
  isOwner,
  activeCount,
  totalCount,
}: PublicProfileHeaderProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [isStartingChat, startChatTransition] = useTransition();
  const router = useRouter();

  const handleMessage = () => {
    startChatTransition(async () => {
      try {
        const result = await startChatWithSeller(user.id);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        if (result.redirectTo) {
          router.replace(result.redirectTo);
        }
      } catch {
        toast.error("Could not open the chat. Please try again.");
      }
    });
  };

  const memberSince = user.createdAt
    ? new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long" }).format(
        new Date(user.createdAt)
      )
    : null;

  const roles = (user.role ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: user.name ?? "Profile", url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShareOpen(true);
        setTimeout(() => setShareOpen(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar + name row */}
      <div className="flex items-start gap-4 sm:gap-6">
        <Avatar className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? ""} />
          ) : null}
          <AvatarFallback className="text-2xl font-bold">
            {initialsFrom(user.name || user.email)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-bold sm:text-2xl">
              {user.name || "Unnamed"}
            </h1>
            {user.verified ? (
              <Badge
                variant="secondary"
                className="gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            ) : null}
          </div>

          {user.companyName ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {user.companyName}
            </p>
          ) : null}

          {roles.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {roles.map((role) => (
                <Badge key={role} variant="outline" className="text-xs capitalize">
                  {role.replace(/-/g, " ")}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Bio */}
      {user.bio ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {user.bio}
        </p>
      ) : null}

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        {user.country ? (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {countryName(user.country)}
          </span>
        ) : null}
        {user.industry ? (
          <span className="inline-flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            {user.industry.replace(/-/g, " ")}
          </span>
        ) : null}
        {user.website ? (
          <a
            href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <Globe2 className="h-3.5 w-3.5" />
            {user.website.replace(/^https?:\/\//, "")}
          </a>
        ) : null}
        {memberSince ? (
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            Member since {memberSince}
          </span>
        ) : null}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 rounded-xl border bg-card px-4 py-3">
        <div className="text-center">
          <p className="text-lg font-bold">{totalCount}</p>
          <p className="text-xs text-muted-foreground">Listings</p>
        </div>
        <div className="h-8 w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {isOwner ? (
          <Button
            className="flex-1"
            render={<Link href={`/${user.id}/dashboard/profile`} />}
            nativeButton={false}
          >
            Edit profile
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleMessage}
            disabled={isStartingChat}
          >
            <MessageCircle className="h-4 w-4" />
            {isStartingChat ? "Opening chat…" : "Message"}
          </Button>
        )}
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {shareOpen ? (
        <p className="text-center text-xs text-muted-foreground">
          Profile link copied to clipboard
        </p>
      ) : null}
    </div>
  );
}
