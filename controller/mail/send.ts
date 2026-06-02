import type { NextFunction, Request, Response } from "express";

import { ParseSendEmailRequest } from "@/dto/request/mail.js";
import { Ok } from "@/packages/httpresp/response.js";
import type { Service } from "@/service/main.js";

export class Handler {
  constructor(private readonly Service: Service) {}

  async Send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = ParseSendEmailRequest(req.body);
      const data = await this.Service.SendEmail(res.locals.context, payload);
      Ok(res, data);
    } catch (error) {
      next(error);
    }
  }
}
