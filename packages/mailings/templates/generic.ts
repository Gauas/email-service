import { DEFAULT_ACTION_LABEL, DEFAULT_FOOTER, DEFAULT_TITLE, EMPTY, type Mailing } from "@/packages/mailings/templates/constants.js";
import { ACTION_STYLE, BODY_STYLE, FOOTER_STYLE } from "@/packages/mailings/templates/auth/styles.js";

export function Generic(data: Record<string, unknown>): Mailing {
  const title = read(data, "title", DEFAULT_TITLE);
  const message = read(data, "message", EMPTY);
  const actionUrl = read(data, "actionUrl", EMPTY);
  const actionLabel = read(data, "actionLabel", DEFAULT_ACTION_LABEL);
  const footer = read(data, "footer", DEFAULT_FOOTER);
  const actionHtml = actionUrl === EMPTY ? EMPTY : `<p><a href="${escape(actionUrl)}" style="${ACTION_STYLE}">${escape(actionLabel)}</a></p>`;
  const actionText = actionUrl === EMPTY ? EMPTY : `\n\n${actionLabel}: ${actionUrl}`;

  return {
    subject: title,
    html: `<div style="${BODY_STYLE}"><h2>${escape(title)}</h2><p>${escape(message)}</p>${actionHtml}<p style="${FOOTER_STYLE}">${escape(footer)}</p></div>`,
    text: `${title}\n\n${message}${actionText}\n\n${footer}`
  };
}

function read(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() !== EMPTY ? value.trim() : fallback;
}

function escape(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
