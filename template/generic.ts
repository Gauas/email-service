import { readFileSync } from "node:fs";

import { ACTION_STYLE, BODY_STYLE, FOOTER_STYLE } from "@/template/styles.js";
import type { Mailing } from "@/template/init.js";

const template = readFileSync(new URL("./generic.html", import.meta.url), "utf8");

const EMPTY = "";
const DEFAULT_TITLE = "Notification";
const DEFAULT_ACTION_LABEL = "Open";
const DEFAULT_FOOTER = "This email was sent automatically.";

export function Generic(data: Record<string, unknown>): Mailing {
  const title = readString(data, "title", DEFAULT_TITLE);

  const message = readString(data, "message", EMPTY);

  const actionUrl = readString(data, "actionUrl", EMPTY);

  const actionLabel = readString(data, "actionLabel", DEFAULT_ACTION_LABEL);

  const footer = readString(data, "footer", DEFAULT_FOOTER);

  const actionHtml = actionUrl === EMPTY ? EMPTY : `<p><a href="${escapeHtml(actionUrl)}" style="${ACTION_STYLE}">${escapeHtml(actionLabel)}</a></p>`;

  const actionText = actionUrl === EMPTY ? EMPTY : `\n\n${actionLabel}: ${actionUrl}`;

  return {
    subject: title,
    html: render(template, {
      bodyStyle: BODY_STYLE,
      title: escapeHtml(title),
      message: escapeHtml(message),
      action: actionHtml,
      footerStyle: FOOTER_STYLE,
      footer: escapeHtml(footer)
    }),
    text: `${title}\n\n${message}${actionText}\n\n${footer}`
  };
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
