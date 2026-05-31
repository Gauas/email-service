import type { Config } from "@/config/main.js";
import type { Service } from "@/service/main.js";
import { Handler } from "@/controller/mail/send.js";

export type MailHandler = Handler;

export function New(service: Service, config: Config): MailHandler {
  return new Handler(service, config);
}
