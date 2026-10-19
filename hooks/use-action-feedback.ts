"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import type { FormState } from "@/lib/validation/auth";

/**
 * Bridges a Server Action's `FormState` to sonner toasts + navigation.
 *
 * Shows an error toast for `status: "error"`, and on `status: "success"`
 * shows a success toast then routes to `redirectTo` (locale resolved by the
 * next-intl router). A ref guards against duplicate toasts on re-render.
 */
export function useActionFeedback(state: FormState) {
  const router = useRouter();
  const lastHandled = useRef<FormState | null>(null);

  useEffect(() => {
    if (state === lastHandled.current) return;
    lastHandled.current = state;

    if (state.status === "error" && state.message) {
      toast.error(state.message);
    }

    if (state.status === "success") {
      if (state.message) toast.success(state.message);
      if (state.redirectTo) {
        router.push(state.redirectTo);
        router.refresh();
      }
    }
  }, [state, router]);
}
