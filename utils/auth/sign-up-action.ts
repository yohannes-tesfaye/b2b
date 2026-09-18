"use server";

export async function signUp(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Name, email, and password are required." };
  }

  // TODO: real account creation
  return { error: null };
}