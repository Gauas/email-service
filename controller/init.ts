import { MailController } from "@/controller/mail/send.js";
import type { Service } from "@/service/init.js";

export type Controller = {
  Mail: MailController;
};

export function Init(service: Service): Controller {
  return {
    Mail: new MailController(service)
  };
}
