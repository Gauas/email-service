import { z } from "zod";

export type RecipientInput = string | string[];

const recipientSchema = z.union([
  z.string().email(),
  z.array(z.string().email()).min(1)
]);

export const sendEmailSchema = z
  .object({
    to: recipientSchema,
    cc: recipientSchema.optional(),
    bcc: recipientSchema.optional(),
    from: z.string().email().optional(),
    replyTo: z.string().email().optional(),
    subject: z.string().trim().optional(),
    text: z.string().trim().optional(),
    html: z.string().trim().optional(),
    template: z.string().trim().optional(),
    data: z.record(z.string(), z.unknown()).optional(),
    headers: z.record(z.string(), z.string()).optional()
  })
  .superRefine((value, ctx) => {
    if (!value.text && !value.html && !value.template) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "text, html, or template is required",
        path: ["text"]
      });
    }
  });

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
export type TemplateData = Record<string, unknown>;
