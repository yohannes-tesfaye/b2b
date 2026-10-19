"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogPopup,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LocaleField from "@/components/i18n/LocaleField";
import { authClient } from "@/lib/auth-client";
import { deleteAccount } from "@/utils/auth/profile-action";
import { initialFormState } from "@/lib/validation/auth";

function DangerZone({ email }: { email: string }) {
  const t = useTranslations("auth");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [state, formAction, isPending] = useActionState(
    deleteAccount,
    initialFormState
  );
  const handled = useRef(false);

  const fieldError =
    state.status === "error" ? state.fieldErrors?.confirmation : undefined;
  const matches = confirmation.toLowerCase() === email.toLowerCase();

  useEffect(() => {
    if (state.status !== "success" || handled.current) return;
    handled.current = true;
    void authClient.signOut().then(() => {
      toast.success(state.message ?? t("profile.accountDeleted"));
      router.push("/");
      router.refresh();
    });
  }, [state, router, t]);

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-destructive/40 p-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="size-4" />
        <h2 className="text-sm font-semibold">{t("profile.dangerTitle")}</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        {t("profile.dangerDescription")}
      </p>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button variant="destructive" type="button">
              {t("profile.deleteAccount")}
            </Button>
          }
        />
        <AlertDialogPopup>
          <AlertDialogTitle>{t("profile.deleteConfirmTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("profile.deleteConfirmDescription", { email })}
          </AlertDialogDescription>

          <form action={formAction} className="flex flex-col gap-4">
            <Field className="gap-2" data-invalid={Boolean(fieldError)}>
              <FieldLabel htmlFor="confirmation">
                {t("profile.deleteConfirmLabel")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="confirmation"
                  name="confirmation"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  placeholder={email}
                  autoComplete="off"
                  aria-invalid={Boolean(fieldError)}
                />
                <FieldError
                  errors={fieldError ? [{ message: fieldError }] : undefined}
                />
              </FieldContent>
            </Field>

            <div className="flex justify-end gap-2">
              <AlertDialogCancel type="button" disabled={isPending}>
                {t("profile.cancel")}
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending || !matches}
              >
                {t("profile.deleteForever")}
              </Button>
            </div>

            <LocaleField />
          </form>
        </AlertDialogPopup>
      </AlertDialog>
    </section>
  );
}

export default DangerZone;
