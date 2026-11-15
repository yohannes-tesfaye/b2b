/**
 * Minimal email helper. Uses Resend when RESEND_API_KEY is configured,
 * otherwise logs the message in development and no-ops in production.
 * Keeps callers dependency-free; swap the transport here if needed.
 */
export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@example.com";

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[email:dev] to=${to} subject=${subject}\n${html}`);
    }
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      console.error(`[email] failed ${res.status}: ${await res.text()}`);
    }
  } catch (error) {
    console.error("[email] send failed", error);
  }
}