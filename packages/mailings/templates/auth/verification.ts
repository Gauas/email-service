import { EMPTY, type Mailing } from "@/packages/mailings/templates/constants.js";
import { Generic } from "@/packages/mailings/templates/generic.js";

const DEFAULT_PRODUCT = "Gauas";
const DEFAULT_RECIPIENT = "there";
const DEFAULT_ACTION = "Verify Email";
const DEFAULT_FOOTER = "If you did not request this, you can ignore this email.";

export function Verification(data: Record<string, unknown>): Mailing {
  const product = read(data, "productName", DEFAULT_PRODUCT);
  const recipient = read(data, "recipientName", DEFAULT_RECIPIENT);
  const actionUrl = read(data, "actionUrl", EMPTY);
  const actionLabel = read(data, "actionLabel", DEFAULT_ACTION);

  return Generic({
    title: `Verify your email for ${product}`,
    message: `Hi ${recipient}, please verify your email address to continue using ${product}.`,
    actionUrl,
    actionLabel,
    footer: DEFAULT_FOOTER
  });
}

function read(data: Record<string, unknown>, key: string, fallback: string): string {
  const value = data[key];
  return typeof value === "string" && value.trim() !== EMPTY ? value.trim() : fallback;
}
