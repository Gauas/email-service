import type { Config } from "@/config/main.js";
import type { SendEmailRequest } from "@/dto/request/mail.js";
import type { SendEmailResponse } from "@/dto/response/mail.js";
import type { Infra } from "@/infra/main.js";
import type { RequestContext } from "@/middlewares/context.js";
import { MailService } from "@/service/mail.js";

export class Service {
  private readonly mail: MailService;

  constructor(
    private readonly Config: Config,
    private readonly Infra: Infra
  ) {
    this.mail = new MailService(this.Config, this.Infra);
  }

  SendEmail(context: RequestContext, req: SendEmailRequest): Promise<SendEmailResponse> {
    return this.mail.Send(context, req);
  }
}

export function New(config: Config, infra: Infra): Service {
  return new Service(config, infra);
}
