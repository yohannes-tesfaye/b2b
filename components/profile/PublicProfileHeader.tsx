"use client";

import { useEffect, useRef, useTransition } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  MessageCircle,
  Share2,
  ShieldCheck,
  MapPin,
  Building2,
  Globe2,
  CalendarDays,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
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
  const [isStartingChat, startChatTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("publicProfile");
  const autoStarted = useRef(false);

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

  // Coming back from sign-in with `?chat=1` opens the conversation right away.
  useEffect(() => {
    if (isOwner || autoStarted.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("chat") !== "1") return;
    autoStarted.current = true;
    params.delete("chat");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
    handleMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwner]);

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
        toast.success(t("header.copied"));
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
                {t("header.verified")}
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
        {user.companySize ? (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {t("header.companySize", { size: user.companySize })}
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
            {t("header.memberSince", { date: memberSince })}
          </span>
        ) : null}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border bg-card px-4 py-3 sm:flex sm:items-center sm:gap-6">
        <div className="text-center">
          <p className="text-lg font-bold">{totalCount}</p>
          <p className="text-xs text-muted-foreground">{t("header.listings")}</p>
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="text-center">
          <p className="text-lg font-bold">{activeCount}</p>
          <p className="text-xs text-muted-foreground">{t("header.active")}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {isOwner ? (
          <Button
            className="flex-1"
            render={<Link href="/dashboard/profile" />}
            nativeButton={false}
          >
            {t("header.editProfile")}
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={handleMessage}
            disabled={isStartingChat}
          >
            <MessageCircle className="h-4 w-4" />
            {isStartingChat ? t("header.openingChat") : t("header.message")}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={handleShare}
          aria-label={t("header.share")}
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
