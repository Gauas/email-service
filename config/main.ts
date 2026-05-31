import dotenv from "dotenv";

import { get, getEnvBool, getEnvInt } from "@/config/helper.js";

export type MailMode = "log" | "smtp";

export type SMTPConfig = {
  Host: string;
  Port: number;
  Secure: boolean;
  User: string;
  Pass: string;
};

export type Config = {
  Port: string;
  NodeEnv: string;
  ServiceName: string;
  InternalApiKey: string;
  MailMode: MailMode;
  MailFrom: string;
  MailReplyTo: string;
  SMTP: SMTPConfig;
};

const DEFAULT_PORT = "8083";
const DEFAULT_NODE_ENV = "development";
const DEFAULT_SERVICE_NAME = "email-service";
const DEFAULT_MAIL_MODE: MailMode = "log";
const DEFAULT_MAIL_FROM = "no-reply@gauas.com";
const DEFAULT_REPLY_TO = "";
const DEFAULT_SMTP_HOST = "";
const DEFAULT_SMTP_PORT = 587;
const DEFAULT_SMTP_SECURE = false;
const DEFAULT_SMTP_USER = "";
const DEFAULT_SMTP_PASS = "";

export function New(): Config {
  dotenv.config();

  const config: Config = {
    Port: get("PORT", DEFAULT_PORT),
    NodeEnv: get("NODE_ENV", DEFAULT_NODE_ENV),
    ServiceName: get("SERVICE_NAME", DEFAULT_SERVICE_NAME),
    InternalApiKey: get("INTERNAL_API_KEY", ""),
    MailMode: parseMailMode(get("MAIL_MODE", DEFAULT_MAIL_MODE)),
    MailFrom: get("MAIL_FROM", DEFAULT_MAIL_FROM),
    MailReplyTo: get("MAIL_REPLY_TO", DEFAULT_REPLY_TO),
    SMTP: {
      Host: get("SMTP_HOST", DEFAULT_SMTP_HOST),
      Port: getEnvInt("SMTP_PORT", DEFAULT_SMTP_PORT),
      Secure: getEnvBool("SMTP_SECURE", DEFAULT_SMTP_SECURE),
      User: get("SMTP_USER", DEFAULT_SMTP_USER),
      Pass: get("SMTP_PASS", DEFAULT_SMTP_PASS)
    }
  };

  validate(config);
  return config;
}

function parseMailMode(value: string): MailMode {
  if (value === "smtp") {
    return "smtp";
  }

  return "log";
}

function validate(config: Config): void {
  if (config.Port === "") {
    throw new Error("config: PORT is required");
  }

  if (config.MailFrom === "") {
    throw new Error("config: MAIL_FROM is required");
  }

  if (config.MailMode === "smtp") {
    if (config.SMTP.Host === "") {
      throw new Error("config: SMTP_HOST is required when MAIL_MODE=smtp");
    }

    if (config.SMTP.User === "") {
      throw new Error("config: SMTP_USER is required when MAIL_MODE=smtp");
    }

    if (config.SMTP.Pass === "") {
      throw new Error("config: SMTP_PASS is required when MAIL_MODE=smtp");
    }
  }
}
