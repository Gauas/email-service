import type { Service } from "@/service/main.js";
import { Handler } from "@/controller/mail/send.js";

export type MailHandler = Handler;

export function New(service: Service): MailHandler {
  return new Handler(service);
}
