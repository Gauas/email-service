import type { TemplateData } from "@/dto/request/mail.js";

export type Mailing = {
  subject?: string;
  html?: string;
  text?: string;
};

export type MailingRenderer = (data: TemplateData) => Mailing;

export const EMPTY = "";
export const DEFAULT_TITLE = "Notification";
export const DEFAULT_ACTION_LABEL = "Open";
export const DEFAULT_FOOTER = "This email was sent automatically.";
