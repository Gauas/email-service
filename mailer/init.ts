import type { Config } from "@/config/init.js";
import type { RecipientInput, SendEmailRequest, TemplateData } from "@/dto/request/mail.js";
import { render, type Mailing } from "@/template/init.js";
import type { MailRecipients, MailTransport, SendMailPayload, SendMailResult } from "@/mailer/transport.js";
import { HttpStatus } from "@/packages/httpresp/status.js";
import { appError } from "@/service/helper.js";

type MailContent = {
  subject: string;
  html?: string;
  text?: string;
};

type MailMetadata = MailRecipients & {
  from: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

const EMPTY = "";

export class Mailer {
  constructor(
    private readonly config: Config,
    private readonly transport: MailTransport
  ) {}

  Send(req: SendEmailRequest): Promise<SendMailResult> {
    const metadata = this.metadata(req);
    const content = this.content(req);

    return this.transport.Send(toPayload(metadata, content));
  }

  private metadata(payload: SendEmailRequest): MailMetadata {
    return {
      ...toRecipients(payload),
      from: payload.from ?? this.config.MailFrom,
      replyTo: pick(payload.replyTo, this.config.MailReplyTo),
      headers: payload.headers
    };
  }

  private content(payload: SendEmailRequest): MailContent {
    const template = tpl(payload.template, payload.data);
    const subject = pick(payload.subject, template?.subject) ?? EMPTY;
    const html = pick(payload.html, template?.html);
    const text = pick(payload.text, template?.text);

    if (subject === EMPTY) throw appError(HttpStatus.BAD_REQUEST, "subject is required");
    if (!html && !text) throw appError(HttpStatus.BAD_REQUEST, "email content is required");

    return { subject, html, text };
  }
}

function toPayload(metadata: MailMetadata, content: MailContent): SendMailPayload {
  return { ...metadata, ...content };
}

function toRecipients(payload: SendEmailRequest): MailRecipients {
  return {
    to: toList(payload.to),
    cc: toList(payload.cc),
    bcc: toList(payload.bcc)
  };
}

function toList(value?: RecipientInput): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function tpl(name?: string, data?: TemplateData): Mailing | null {
  if (!name) return null;

  return render(name, data ?? {});
}

function pick(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== EMPTY) return value.trim();
  }

  return undefined;
}
