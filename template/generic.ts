import { readFileSync } from "node:fs";

import { DEFAULT_LOGO_URL } from "@/template/logo.js";
import { ACTION_STYLE, BODY_STYLE, FOOTER_STYLE, HEADER_STYLE, LOGO_STYLE, MESSAGE_STYLE, TITLE_STYLE } from "@/template/styles.js";
import type { Mailing } from "@/template/init.js";

const template = readFileSync(new URL("./generic.html", import.meta.url), "utf8");

const EMPTY = "";
const DEFAULT_TITLE = "Notification";
const DEFAULT_ACTION_LABEL = "Open";
const DEFAULT_FOOTER = "This email was sent automatically.";
const DEFAULT_LOGO_ALT = "Gauas";

export function Generic(data: Record<string, unknown>): Mailing {
  const title = readString(data, "title", DEFAULT_TITLE);

  const message = readString(data, "message", EMPTY);

  const actionUrl = readString(data, "actionUrl", EMPTY);

  const actionLabel = readString(data, "actionLabel", DEFAULT_ACTION_LABEL);

  const footer = readString(data, "footer", DEFAULT_FOOTER);

  const logoUrl = readString(data, "logoUrl", DEFAULT_LOGO_URL);

  const logoAlt = readString(data, "logoAlt", DEFAULT_LOGO_ALT);

  const actionHtml = actionUrl === EMPTY ? EMPTY : `<p><a href="${escapeHtml(actionUrl)}" style="${ACTION_STYLE}">${escapeHtml(actionLabel)}</a></p>`;

  const actionText = actionUrl === EMPTY ? EMPTY : `\n\n${actionLabel}: ${actionUrl}`;

  return {
    subject: title,
    html: render(template, {
      bodyStyle: BODY_STYLE,
      headerStyle: HEADER_STYLE,
      logo: renderLogo(logoUrl, logoAlt),
      title: escapeHtml(title),
      titleStyle: TITLE_STYLE,
      message: escapeHtml(message),
      messageStyle: MESSAGE_STYLE,
      action: actionHtml,
      footerStyle: FOOTER_STYLE,
      footer: escapeHtml(footer)
    }),
    text: `${title}\n\n${message}${actionText}\n\n${footer}`
  };
}

function renderLogo(url: string, alt: string): string {
  if (url === EMPTY) return EMPTY;

  return `<img src="${escapeHtml(url)}" width="64" height="64" alt="${escapeHtml(alt)}" style="${LOGO_STYLE}">`;
}

function render(html: string, data: Record<string, string>): string {
  return html.replaceAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => data[key] ?? EMPTY);
}

function readString(data: Record<string, unknown>, key: string, def: string): string {
  const value = data[key];

  return typeof value === "string" && value.trim() !== EMPTY ? value.trim() : def;
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
