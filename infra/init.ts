import type { Config } from "@/config/init.js";
import { NodemailerTransport } from "@/mailer/transport.js";

export type Infra = {
  MailTransport: NodemailerTransport;
};

export function Init(config: Config): Infra {
  return {
    MailTransport: new NodemailerTransport(config)
  };
}
