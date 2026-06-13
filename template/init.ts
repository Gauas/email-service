import type { TemplateData } from "@/dto/request/mail.js";
import { Verification } from "@/template/auth/verification.js";
import { Generic } from "@/template/generic.js";
import { fail } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";

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

const templates = new Map<string, MailingRenderer>([
  ["generic", Generic],
  ["verification", Verification]
]);

export function render(name: string, data: TemplateData): Mailing {
  return get(name)(data);
}

export function add(name: string, renderer: MailingRenderer): void {
  templates.set(name, renderer);
}

export function list(): string[] {
  return [...templates.keys()];
}

export function get(name: string): MailingRenderer {
  const template = templates.get(name);

  if (!template) throw fail(HttpStatus.BAD_REQUEST, "unsupported template");

  return template;
}
