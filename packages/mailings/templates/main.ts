import type { TemplateData } from "@/dto/request/mail.js";
import { Fail } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";
import { Verification } from "@/packages/mailings/templates/auth/verification.js";
import { Generic } from "@/packages/mailings/templates/generic.js";
import type { Mailing, MailingRenderer } from "@/packages/mailings/templates/constants.js";

const templates = new Map<string, MailingRenderer>([
  ["generic", Generic],
  ["verification", Verification]
]);

export function Add(name: string, renderer: MailingRenderer): void {
  templates.set(name, renderer);
}

export function Get(name: string): MailingRenderer {
  const template = templates.get(name);
  if (!template) throw Fail(HttpStatus.BAD_REQUEST, "unsupported template");
  return template;
}

export function Render(name: string, data: TemplateData): Mailing {
  return Get(name)(data);
}

export function List(): string[] {
  return [...templates.keys()];
}
