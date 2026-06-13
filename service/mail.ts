import type { Config } from "@/config/init.js";
import type { SendEmailRequest } from "@/dto/request/mail.js";
import type { SendEmailResponse } from "@/dto/response/mail.js";
import type { Infra } from "@/infra/init.js";
import { Mailer } from "@/mailer/init.js";
import type { SendMailResult } from "@/mailer/transport.js";
import type { RequestContext } from "@/middlewares/context.js";

export class MailService {
  private readonly mailer: Mailer;

  constructor(
    private readonly config: Config,
    private readonly infra: Infra
  ) {
    this.mailer = new Mailer(this.config, this.infra.MailTransport);
  }

  async Send(context: RequestContext, req: SendEmailRequest): Promise<SendEmailResponse> {
    void context;

    const mail = await this.mailer.Send(req);
    return toResp(mail);
  }
}

function toResp(mail: SendMailResult): SendEmailResponse {
  return { message_id: mail.MessageID, accepted: mail.Accepted, rejected: mail.Rejected };
}
