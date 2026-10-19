"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AvatarUpload from "./AvatarUpload";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import DangerZone from "./DangerZone";
import { ROLE_META, parseRoles } from "@/lib/profile";
import type { ProfileUser } from "./types";

function roleLabels(
  role: string | null | undefined,
  t: (key: string) => string
): string[] {
  const values = parseRoles(role);
  return ROLE_META.filter((meta) => values.includes(meta.value)).map((meta) =>
    t(meta.labelKey)
  );
}

function ProfileView({ user }: { user: ProfileUser }) {
  const t = useTranslations("auth");
  const roles = roleLabels(user.role, t as (key: string) => string);

  const memberSince = user.createdAt
    ? new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
      }).format(new Date(user.createdAt))
    : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("profile.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("profile.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <AvatarUpload
            name={user.name}
            email={user.email}
            image={user.image}
          />
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex flex-wrap gap-1.5 sm:justify-end">
              {roles.length ? (
                roles.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  {t("reviewNoRoles")}
                </span>
              )}
            </div>
            {memberSince ? (
              <span className="text-xs text-muted-foreground">
                {t("profile.memberSince", { date: memberSince })}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <Tabs defaultValue="personal" className="mt-8">
        <TabsList variant="line">
          <TabsTrigger value="personal">
            {t("profile.tabPersonal")}
          </TabsTrigger>
          <TabsTrigger value="security">
            {t("profile.tabSecurity")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="pt-6">
          <ProfileForm user={user} />
        </TabsContent>

        <TabsContent value="security" className="pt-6">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="mb-4 text-sm font-semibold">
                {t("profile.passwordTitle")}
              </h2>
              <PasswordForm />
            </div>
            <DangerZone email={user.email} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfileView;
