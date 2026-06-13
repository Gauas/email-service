import type { Mailing } from "@/template/init.js";

const EMPTY = "";
const DEFAULT_PRODUCT = "Gauas";
const DEFAULT_CODE = "000000";
const DEFAULT_TITLE_PREFIX = "Sign in to";
const DEFAULT_MESSAGE = "Copy and paste the temporary verification code to sign in. If you did not try to sign in, you can safely ignore this email.";
const DEFAULT_FOOTER = "This email was sent automatically.";
const DEFAULT_LOGO_ALT = "Gauas";

const S = {
  page: "margin:0;padding:0;background:#efeee8;color:#292724;",
  outer: "width:100%;background:#efeee8;border-collapse:collapse;",
  shell: "padding:58px 24px 44px;",
  main: "width:100%;max-width:960px;border-collapse:collapse;text-align:center;",
  title: "font-family:Arial,Helvetica,sans-serif;font-size:32px;line-height:40px;font-weight:700;color:#2b2926;padding:0 0 66px;",
  codeBox: "width:100%;max-width:640px;border-collapse:separate;background:#222222;border-radius:16px;",
  code: "font-family:'Courier New',Courier,monospace;font-size:44px;line-height:52px;font-weight:700;letter-spacing:12px;color:#ffffff;text-align:center;padding:48px 28px;",
  message: "font-family:Arial,Helvetica,sans-serif;font-size:30px;line-height:40px;font-weight:400;color:#2b2926;padding:0 0 112px;",
  brand: "font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:28px;font-weight:700;letter-spacing:.04em;color:#8f8c86;text-transform:uppercase;padding:0 0 26px;",
  footer: "font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:26px;color:#9b9892;",
  link: "color:#9b9892;text-decoration:none;",
  fallbackLogo: "font-family:Arial,Helvetica,sans-serif;font-size:48px;line-height:56px;font-weight:800;color:#242321;",
  imageLogo: "display:block;border:0;outline:none;text-decoration:none;width:64px;height:64px;object-fit:contain;"
};

type FooterLink = {
  label: string;
  url?: string;
};

type VerificationView = {
  product: string;
  title: string;
  code: string;
  message: string;
  footer: string;
  logoUrl: string;
  logoAlt: string;
  footerLinks: FooterLink[];
};

export function Verification(data: Record<string, unknown>): Mailing {
  const view = toView(data);

  return {
    subject: view.title,
    html: renderHtml(view),
    text: renderText(view)
  };
}

function toView(data: Record<string, unknown>): VerificationView {
  const product = readString(data, "productName", DEFAULT_PRODUCT);

  return {
    product,
    code: readString(data, "code", readString(data, "verificationCode", DEFAULT_CODE)),
    title: readString(data, "title", `${DEFAULT_TITLE_PREFIX} ${product}`),
    message: readString(data, "message", DEFAULT_MESSAGE),
    footer: readString(data, "footer", DEFAULT_FOOTER),
    logoUrl: readString(data, "logoUrl", EMPTY),
    logoAlt: readString(data, "logoAlt", DEFAULT_LOGO_ALT),
    footerLinks: readFooterLinks(data.footerLinks)
  };
}

function renderHtml(view: VerificationView): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(view.title)}</title>
  </head>
  <body style="${S.page}">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(view.code)} is your temporary verification code.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.outer}">
      <tr>
        <td align="center" style="${S.shell}">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.main}">
            ${row(renderLogo(view), "padding:0 0 54px;")}
            ${row(escapeHtml(view.title), S.title)}
            ${row(codeBox(view.code), "padding:0 0 62px;", "center")}
            ${row(`<div style="max-width:830px;margin:0 auto;">${escapeHtml(view.message)}</div>`, S.message, "center")}
            ${row(escapeHtml(view.product), S.brand)}
            ${row(renderFooter(view), S.footer)}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderText(view: VerificationView): string {
  const footer = footerLinksText(view.footerLinks) || view.footer;

  return `${view.title}

${view.code}

${view.message}

${view.product}
${footer}`;
}

function row(content: string, style: string, align?: "center"): string {
  const alignAttr = align ? ` align="${align}"` : EMPTY;
  return `<tr><td${alignAttr} style="${style}">${content}</td></tr>`;
}

function codeBox(code: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="${S.codeBox}"><tr><td style="${S.code}">${escapeHtml(formatCode(code))}</td></tr></table>`;
}

function renderLogo(view: VerificationView): string {
  if (view.logoUrl === EMPTY) return fallbackLogo(view.product);

  return `<img src="${escapeHtml(view.logoUrl)}" width="64" height="64" alt="${escapeHtml(view.logoAlt)}" style="${S.imageLogo}">`;
}

function fallbackLogo(product: string): string {
  const letters = product
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return `<div style="${S.fallbackLogo}">${escapeHtml(letters || "G")}</div>`;
}

function renderFooter(view: VerificationView): string {
  return footerLinksHtml(view.footerLinks) || escapeHtml(view.footer);
}

function footerLinksHtml(links: FooterLink[]): string {
  return links
    .map((link) => {
      const label = escapeHtml(link.label);

      if (!link.url) return label;

      return `<a href="${escapeHtml(link.url)}" style="${S.link}">${label}</a>`;
    })
    .join(" <span style=\"color:#aaa7a1;\">&bull;</span> ");
}

function footerLinksText(links: FooterLink[]): string {
  return links.map((link) => (link.url ? `${link.label}: ${link.url}` : link.label)).join(" - ");
}

function formatCode(value: string): string {
  return value.replaceAll(/\s+/g, EMPTY).toUpperCase();
}

function readFooterLinks(value: unknown): FooterLink[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string" && item.trim() !== EMPTY) return { label: item.trim() };
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label.trim() : EMPTY;
      const url = typeof record.url === "string" ? record.url.trim() : EMPTY;

      if (label === EMPTY) return null;

      return { label, url: url === EMPTY ? undefined : url };
    })
    .filter((item): item is FooterLink => item !== null);
}

function readString(data: Record<string, unknown>, key: string, def: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() !== EMPTY ? value.trim() : def;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
