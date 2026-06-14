import { DEFAULT_LOGO_URL } from "@/template/logo.js";
import type { Mailing } from "@/template/init.js";

const EMPTY = "";
const DEFAULT_PRODUCT = "Gauas";
const DEFAULT_CODE = "000000";
const DEFAULT_EXPIRES_IN = "10";
const DEFAULT_LOGO_ALT = "Gauas";
const PREHEADER = "Use this verification code to securely sign in to your Gauas account.";
const PREHEADER_SPACER = "&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;";

const S = {
  page: "margin:0;padding:0;background-color:#f6f8fa;color:#24292f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;",
  outer: "width:100%;background-color:#f6f8fa;border-collapse:collapse;",
  shell: "padding:24px 12px;",
  main: "width:100%;max-width:600px;border-collapse:collapse;",
  logoCell: "padding:0 0 20px 0;text-align:center;",
  imageLogo: "display:block;margin:0 auto;border:0;outline:none;text-decoration:none;width:44px;height:44px;",
  fallbackLogo: "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:22px;line-height:28px;font-weight:700;color:#111827;letter-spacing:0;",
  card: "background-color:#ffffff;border:1px solid #d8dee4;border-radius:8px;padding:28px 24px 24px 24px;",
  title: "margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;line-height:32px;font-weight:700;color:#111827;",
  paragraph: "margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:24px;font-weight:400;color:#374151;",
  meta: "margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:22px;font-weight:400;color:#4b5563;",
  codeBox: "width:100%;border-collapse:separate;background-color:#f3f4f6;border:1px solid #d1d5db;border-radius:8px;",
  code: "font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,Courier,monospace;font-size:36px;line-height:44px;font-weight:700;letter-spacing:6px;color:#111827;text-align:center;padding:22px 16px;",
  warning: "margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:21px;font-weight:400;color:#6b7280;",
  footerWrap: "padding:18px 12px 0 12px;",
  footerDivider: "border-top:1px solid #d8dee4;padding-top:16px;",
  footer: "margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:12px;line-height:20px;font-weight:400;color:#6b7280;text-align:center;",
  link: "color:#0969da;text-decoration:none;",
  strong: "font-weight:600;color:#111827;"
};

type VerificationView = {
  product: string;
  code: string;
  expiresIn: string;
  logoUrl: string;
  logoAlt: string;
};

export function Verification(data: Record<string, unknown>): Mailing {
  const view = toView(data);

  return {
    subject: "Sign in to Gauas",
    html: renderHtml(view),
    text: renderText(view)
  };
}

function toView(data: Record<string, unknown>): VerificationView {
  const product = readString(data, ["product_name", "productName", "product"], DEFAULT_PRODUCT);

  return {
    product,
    code: readString(data, ["otp_code", "otpCode", "code", "verificationCode"], DEFAULT_CODE),
    expiresIn: readString(data, ["expires_in", "expiresIn"], DEFAULT_EXPIRES_IN),
    logoUrl: readString(data, ["logo_url", "logoUrl"], DEFAULT_LOGO_URL),
    logoAlt: readString(data, ["logo_alt", "logoAlt"], DEFAULT_LOGO_ALT)
  };
}

function renderHtml(view: VerificationView): string {
  const title = "Sign in to Gauas";
  const code = formatCode(view.code);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="${S.page}">
    <div style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;color:transparent;">${escapeHtml(PREHEADER)}${PREHEADER_SPACER}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.outer}">
      <tr>
        <td align="center" style="${S.shell}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.main}">
            ${row(renderLogo(view), S.logoCell, "center")}
            <tr>
              <td style="${S.card}">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-collapse:collapse;">
                  ${row(`<h1 style="${S.title}">Hello,</h1>`, "padding:0 0 12px 0;")}
                  ${row(`<p style="${S.paragraph}">We received a request to sign in to your Gauas account. Use the verification code below to continue.</p>`, "padding:0 0 20px 0;")}
                  ${row(codeBox(code), "padding:4px 0 20px 0;", "center")}
                  ${row(`<p style="${S.meta}">This code expires in <strong style="${S.strong}">${escapeHtml(view.expiresIn)} minutes</strong>.</p>`, "padding:0 0 16px 0;")}
                  ${row(`<p style="${S.warning}">If you didn't request this email, you can safely ignore it.</p>`, "padding:16px 0 0 0;border-top:1px solid #e5e7eb;")}
                </table>
              </td>
            </tr>
            ${row(renderFooter(), S.footerWrap, "center")}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(view: VerificationView): string {
  const code = formatCode(view.code);

  return `Hello,

We received a request to sign in to your Gauas account. Use the verification code below to continue.

${code}

This code expires in ${view.expiresIn} minutes.

If you didn't request this email, you can safely ignore it.

Need help? Contact support@gauas.com
\u00a9 2026 Gauas. All rights reserved.`;
}

function row(content: string, style: string, align?: "center"): string {
  const alignAttr = align ? ` align="${align}"` : EMPTY;
  return `<tr><td${alignAttr} style="${style}">${content}</td></tr>`;
}

function codeBox(code: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.codeBox}"><tr><td style="${S.code}">${escapeHtml(code)}</td></tr></table>`;
}

function renderFooter(): string {
  return `<div style="${S.footerDivider}">
    <p style="${S.footer}">Need help? Contact <a href="mailto:support@gauas.com" style="${S.link}">support@gauas.com</a></p>
    <p style="${S.footer}">&copy; 2026 Gauas. All rights reserved.</p>
  </div>`;
}

function renderLogo(view: VerificationView): string {
  if (view.logoUrl === EMPTY) return fallbackLogo(view.product);

  return `<img src="${escapeHtml(view.logoUrl)}" width="44" height="44" alt="${escapeHtml(view.logoAlt)}" style="${S.imageLogo}">`;
}

function fallbackLogo(product: string): string {
  return `<div style="${S.fallbackLogo}">${escapeHtml(product)}</div>`;
}

function formatCode(value: string): string {
  return value.replaceAll(/\s+/g, EMPTY).toUpperCase();
}

function readString(data: Record<string, unknown>, keys: string[], def: string): string {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string" && value.trim() !== EMPTY) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return def;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
