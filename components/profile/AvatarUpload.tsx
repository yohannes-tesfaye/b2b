"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import LocaleField from "@/components/i18n/LocaleField";
import { uploadAvatar } from "@/utils/auth/profile-action";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { initialFormState } from "@/lib/validation/auth";
import { initialsFrom } from "@/lib/profile";

const MAX_DIMENSION = 256;
const OUTPUT_QUALITY = 0.85;

async function fileToResizedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("decode-failed"));
    element.src = dataUrl;
  });

  const longest = Math.max(image.width, image.height);
  const scale = longest > MAX_DIMENSION ? MAX_DIMENSION / longest : 1;
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return dataUrl;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", OUTPUT_QUALITY);
}

function AvatarUpload({
  name,
  email,
  image,
}: {
  name: string;
  email: string;
  image?: string | null;
}) {
  const t = useTranslations("auth");
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [state, formAction, isPending] = useActionState(
    uploadAvatar,
    initialFormState
  );

  useActionFeedback(state);

  const shownImage = preview || image || "";
  const error = state.status === "error" && !state.fieldErrors;

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("profile.avatarInvalid"));
      event.target.value = "";
      return;
    }
    try {
      setPreview(await fileToResizedDataUrl(file));
    } catch {
      toast.error(t("profile.avatarInvalid"));
    }
  };

  return (
    <form action={formAction} className="flex items-center gap-4">
      <Avatar size="lg" className="size-16">
        {shownImage ? <AvatarImage src={shownImage} alt={name} /> : null}
        <AvatarFallback className="text-base">
          {initialsFrom(name || email)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col gap-1">
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <input type="hidden" name="image" value={preview} />

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
          >
            <Camera />
            {t("profile.changePhoto")}
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !preview}
          >
            {t("profile.savePhoto")}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("profile.photoHint")}
        </p>
        {error ? <FieldError>{state.message}</FieldError> : null}
      </div>

      <LocaleField />
    </form>
  );
}

export default AvatarUpload;
