import nodemailer from "nodemailer";

import type { Config } from "@/config/main.js";

const JSON_LOG_INDENT = 2;
const EMPTY_RECIPIENTS_LENGTH = 0;

export type MailAddressCollection = {
  to: string[];
  cc: string[];
  bcc: string[];
};

export type SendMailPayload = MailAddressCollection & {
  from: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
};

export type SendMailResult = {
  MessageID: string;
  Accepted: string[];
  Rejected: string[];
};

export class Mailer {
  private readonly transporter;

  constructor(private readonly config: Config) {
    if (config.MailMode === "smtp") {
      this.transporter = nodemailer.createTransport({
        host: config.SMTP.Host,
        port: config.SMTP.Port,
        secure: config.SMTP.Secure,
        auth: {
          user: config.SMTP.User,
          pass: config.SMTP.Pass
        }
      });

      return;
    }

    this.transporter = null;
  }

  async Send(payload: SendMailPayload): Promise<SendMailResult> {
    if (this.config.MailMode === "log" || this.transporter === null) {
      const messageId = `log-${Date.now()}`;

      console.log(
        JSON.stringify(
          {
            service: this.config.ServiceName,
            type: "email.send",
            message_id: messageId,
            payload
          },
          null,
          JSON_LOG_INDENT
        )
      );

      return {
        MessageID: messageId,
        Accepted: payload.to,
        Rejected: []
      };
    }

    const result = await this.transporter.sendMail(toPayload(payload));

    return {
      MessageID: result.messageId,
      Accepted: result.accepted.map(String),
      Rejected: result.rejected.map(String)
    };
  }
}

function toPayload(payload: SendMailPayload) {
  return {
    from: payload.from,
    to: payload.to,
    cc: payload.cc.length > EMPTY_RECIPIENTS_LENGTH ? payload.cc : undefined,
    bcc: payload.bcc.length > EMPTY_RECIPIENTS_LENGTH ? payload.bcc : undefined,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    headers: payload.headers
  };
}
