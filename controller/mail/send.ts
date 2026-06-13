import type { NextFunction, Request, Response } from "express";

import { parseSendEmailRequest } from "@/dto/request/mail.js";
import * as http from "@/packages/httpresp/response.js";
import type { Service } from "@/service/init.js";

export class MailController {
  constructor(private readonly service: Service) {}

  async Send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = parseSendEmailRequest(req.body);

      const data = await this.service.SendEmail(res.locals.context, payload);

      http.success(res, data);
    } catch (error) {
      next(error);
    }
  }
}
