import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .min(1, { message: "validation.emailRequired" })
  .pipe(z.email({ message: "validation.emailInvalid" }));

const passwordField = z
  .string()
  .min(8, { message: "validation.passwordMin" })
  .max(128, { message: "validation.passwordMax" });

const nameField = z
  .string()
  .trim()
  .min(1, { message: "validation.nameRequired" })
  .max(120, { message: "validation.nameMax" });

export const signUpSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
});

export const logInSchema = z.object({
  email: emailField,
  password: z.string().min(1, { message: "validation.passwordRequired" }),
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "validation.tokenRequired" }),
    password: passwordField,
    confirmPassword: z
      .string()
      .min(1, { message: "validation.confirmRequired" }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "validation.passwordMismatch",
    path: ["confirmPassword"],
  });

export const onboardingSchema = z.object({
  roles: z.array(z.string()).min(1, { message: "validation.rolesRequired" }),
  companyName: z
    .string()
    .trim()
    .min(1, { message: "validation.companyNameRequired" })
    .max(160, { message: "validation.companyNameMax" }),
  phone: z
    .string()
    .trim()
    .min(1, { message: "validation.phoneRequired" })
    .max(40, { message: "validation.phoneMax" }),
  website: z.union([z.literal(""), z.url({ message: "validation.websiteInvalid" })]),
  country: z.string().trim().min(1, { message: "validation.countryRequired" }),
  industry: z.string().trim().min(1, { message: "validation.industryRequired" }),
  companySize: z.string().optional(),
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type LogInValues = z.infer<typeof logInSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;

/**
 * Normalised shape every auth Server Action returns to `useActionState`.
 * Messages are already translated, so the client can render them verbatim.
 */
export type FormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  redirectTo?: string;
};

export const initialFormState: FormState = { status: "idle" };

/** Loose translator shape so shared helpers can accept any next-intl namespace. */
export type Translate = (key: string) => string;

/**
 * Map zod issues to per-field translated messages.
 * Zod messages are authored as i18n keys under the `validation.*` namespace.
 */
export function zodIssuesToFieldErrors(
  error: z.ZodError,
  t: Translate
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (fieldErrors[field]) continue;
    fieldErrors[field] = issue.message.startsWith("validation.")
      ? t(issue.message)
      : t("validation.formError");
  }
  return fieldErrors;
}
