import nodemailer from "nodemailer";

import type { Config } from "@/config/init.js";

export type MailRecipients = {
  to: string[];
  cc: string[];
  bcc: string[];
};

export type SendMailPayload = MailRecipients & {
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

export interface MailTransport {
  Send(payload: SendMailPayload): Promise<SendMailResult>;
}

const LOG_INDENT = 2;
const NO_RECIPIENT = 0;

export class NodemailerTransport implements MailTransport {
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
      const messageID = `log-${Date.now()}`;

      console.log(
        JSON.stringify(
          {
            service: this.config.ServiceName,
            type: "email.send",
            message_id: messageID,
            payload
          },
          null,
          LOG_INDENT
        )
      );

      return {
        MessageID: messageID,
        Accepted: payload.to,
        Rejected: []
      };
    }

    const result = await this.transporter.sendMail(toNodemailerPayload(payload));

    return {
      MessageID: result.messageId,
      Accepted: result.accepted.map(String),
      Rejected: result.rejected.map(String)
    };
  }
}

function toNodemailerPayload(payload: SendMailPayload) {
  return {
    from: payload.from,
    to: payload.to,
    cc: payload.cc.length > NO_RECIPIENT ? payload.cc : undefined,
    bcc: payload.bcc.length > NO_RECIPIENT ? payload.bcc : undefined,
    replyTo: payload.replyTo,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
    headers: payload.headers
  };
}
