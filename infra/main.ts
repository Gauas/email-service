import type { Config } from "@/config/main.js";
import { Mailer } from "@/infra/mailer.js";

export type Infra = {
  Mailer: Mailer;
};

export function New(config: Config): Infra {
  return {
    Mailer: new Mailer(config)
  };
}
