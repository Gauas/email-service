import type { Config } from "@/config/main.js";
import type { RecipientInput, SendEmailRequest, TemplateData } from "@/dto/request/mail.js";
import type { SendEmailResponse } from "@/dto/response/mail.js";
import type { Infra } from "@/infra/main.js";
import type { MailAddressCollection, SendMailPayload, SendMailResult } from "@/infra/mailer.js";
import type { RequestContext } from "@/middlewares/context.js";
import { HttpStatus } from "@/packages/httpresp/status.js";
import { Render } from "@/packages/mailings/templates/main.js";
import type { Mailing } from "@/packages/mailings/templates/constants.js";
import { appError } from "@/service/helper.js";

const EMPTY_STRING = "";

type MailContent = {
  subject: string;
  html?: string;
  text?: string;
};

type MailEnvelope = MailAddressCollection & {
  from: string;
  replyTo?: string;
  headers?: Record<string, string>;
};

export class MailService {
  constructor(
    private readonly Config: Config,
    private readonly Infra: Infra
  ) {}

  async Send(context: RequestContext, req: SendEmailRequest): Promise<SendEmailResponse> {
    void context;

    const envelope = this.envelope(req);
    const content = this.content(req);
    const result = await this.Infra.Mailer.Send(this.payload(envelope, content));
    return toResp(result);
  }

  private envelope(payload: SendEmailRequest): MailEnvelope {
    return {
      ...toAddrs(payload),
      from: payload.from ?? this.Config.MailFrom,
      replyTo: pick(payload.replyTo, this.Config.MailReplyTo),
      headers: payload.headers
    };
  }

  private content(payload: SendEmailRequest): MailContent {
    const template = tpl(payload.template, payload.data);
    const subject = pick(payload.subject, template?.subject) ?? EMPTY_STRING;
    const html = pick(payload.html, template?.html);
    const text = pick(payload.text, template?.text);

    if (subject === EMPTY_STRING) throw appError(HttpStatus.BAD_REQUEST, "subject is required");
    if (!html && !text) throw appError(HttpStatus.BAD_REQUEST, "email content is required");

    return { subject, html, text };
  }

  private payload(envelope: MailEnvelope, content: MailContent): SendMailPayload {
    return { ...envelope, ...content };
  }
}

function toAddrs(payload: SendEmailRequest): MailAddressCollection {
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

function tpl(templateName?: string, data?: TemplateData): Mailing | null {
  if (!templateName) return null;
  return Render(templateName, data ?? {});
}

function pick(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== EMPTY_STRING) return value.trim();
  }

  return undefined;
}

function toResp(result: SendMailResult): SendEmailResponse {
  return { message_id: result.MessageID, accepted: result.Accepted, rejected: result.Rejected };
}
