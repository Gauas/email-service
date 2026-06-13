import type { Config } from "@/config/init.js";
import type { SendEmailRequest } from "@/dto/request/mail.js";
import type { SendEmailResponse } from "@/dto/response/mail.js";
import type { Infra } from "@/infra/init.js";
import type { RequestContext } from "@/middlewares/context.js";
import { MailService } from "@/service/mail.js";

export function Init(config: Config, infra: Infra): Service {
  return new Service(config, infra);
}

export class Service {
  private readonly mail: MailService;

  constructor(
    private readonly config: Config,
    private readonly infra: Infra
  ) {
    this.mail = new MailService(this.config, this.infra);
  }

  SendEmail(context: RequestContext, req: SendEmailRequest): Promise<SendEmailResponse> {
    return this.mail.Send(context, req);
  }
}
