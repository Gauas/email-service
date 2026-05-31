import type { Config } from "@/config/main.js";
import { New as newMailHandler } from "@/controller/mail/handler.js";
import type { Service } from "@/service/main.js";

export type Controller = {
  Mail: ReturnType<typeof newMailHandler>;
};

export function New(service: Service, config: Config): Controller {
  return {
    Mail: newMailHandler(service, config)
  };
}
