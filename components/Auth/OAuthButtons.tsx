"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.276c0-.815-.071-1.598-.204-2.351H12.242v4.448h6.596a5.586 5.586 0 0 1-2.42 3.665v3.05h3.92c2.294-2.112 3.662-5.222 3.662-8.812z" />
      <path d="M12.242 24c3.312 0 6.092-1.098 8.123-2.98l-3.92-3.05c-1.089.731-2.479 1.161-4.203 1.161-3.231 0-5.967-2.183-6.946-5.117H1.236v3.148A12.006 12.006 0 0 0 12.242 24z" />
      <path d="M5.296 15.014a7.238 7.238 0 0 1 0-4.627V7.239H1.236a12.006 12.006 0 0 0 0 10.923l4.06-3.148z" />
      <path d="M12.242 4.799c1.8 0 3.418.619 4.691 1.835l3.52-3.52C18.329 1.152 15.55 0 12.242 0 7.5 0 3.38 2.724 1.236 6.699l4.06 3.148c.979-2.934 3.715-5.048 6.946-5.048z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const providers = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "facebook", label: "Continue with Facebook", Icon: FacebookIcon },
  { id: "tiktok", label: "Continue with TikTok", Icon: TikTokIcon },
] as const;

function OAuthButtons() {
  const t = useTranslations("auth");
  const handleSignIn = async (provider: string) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin,
      });
    } catch {
      toast.error(t("errors.generic"));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {providers.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleSignIn(id)}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  );
}

export default OAuthButtons;
