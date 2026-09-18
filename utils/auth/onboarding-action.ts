"use server";

import { redirect } from "next/navigation";

export async function finishOnboarding(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const roles = formData.getAll("roles").map(String);
  const companyName = String(formData.get("companyName") ?? "");
  const phone = String(formData.get("phone") ?? "");

  if (!roles.length || !companyName || !phone) {
    return { error: "Select a role and fill in company name and phone." };
  }

  // TODO: save the user's onboarding details
  redirect("/");
}