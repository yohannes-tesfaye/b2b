/**
 * Branded, minimal HTML email templates for inquiry notifications.
 * Keep markup table-friendly and inline-styled so it renders in most clients.
 */

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrap(title: string, body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="padding:24px 28px;background:#0f172a;color:#ffffff;">
              <p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.7;">Ethio Trade</p>
              <h1 style="margin:6px 0 0;font-size:20px;font-weight:600;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px;font-size:15px;line-height:1.6;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #eee;font-size:12px;color:#6b7280;">
              You received this because someone messaged you on Ethio Trade.
              <br />Reply directly in the thread — do not reply to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function newInquiryEmail(input: {
  recipientName: string | null;
  listingTitle: string;
  message: string;
  threadUrl: string;
}) {
  const name = input.recipientName ? escapeHtml(input.recipientName) : "there";
  const title = escapeHtml(input.listingTitle);
  const message = escapeHtml(input.message).replace(/\n/g, "<br />");
  const url = escapeHtml(input.threadUrl);
  const body = `
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 12px;">You have a new inquiry about <strong>${title}</strong>.</p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:3px solid #2563eb;background:#f8fafc;color:#374151;border-radius:6px;">
      ${message}
    </blockquote>
    <p style="margin:16px 0 0;">
      <a href="${url}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:500;">Reply in thread</a>
    </p>
    <p style="margin:12px 0 0;font-size:13px;color:#6b7280;">Or open: <a href="${url}" style="color:#2563eb;">${url}</a></p>`;
  return wrap(`New inquiry: ${input.listingTitle}`, body);
}

export function newReplyEmail(input: {
  recipientName: string | null;
  listingTitle: string;
  message: string;
  threadUrl: string;
}) {
  const name = input.recipientName ? escapeHtml(input.recipientName) : "there";
  const title = escapeHtml(input.listingTitle);
  const message = escapeHtml(input.message).replace(/\n/g, "<br />");
  const url = escapeHtml(input.threadUrl);
  const body = `
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 12px;">You have a new reply about <strong>${title}</strong>.</p>
    <blockquote style="margin:12px 0;padding:12px 16px;border-left:3px solid #2563eb;background:#f8fafc;color:#374151;border-radius:6px;">
      ${message}
    </blockquote>
    <p style="margin:16px 0 0;">
      <a href="${url}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:500;">View conversation</a>
    </p>`;
  return wrap(`New reply: ${input.listingTitle}`, body);
}
