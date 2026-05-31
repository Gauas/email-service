import type { NextFunction, Request, Response } from "express";

import type { Config } from "@/config/main.js";
import type { SendEmailRequest } from "@/dto/request/mail.js";
import { Ok } from "@/packages/httpresp/response.js";
import type { Service } from "@/service/main.js";

export class Handler {
  constructor(
    private readonly Service: Service,
    private readonly Config: Config
  ) {
    void this.Config;
  }

  async Send(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.Service.SendEmail(res.locals.context, req.body as SendEmailRequest);
      Ok(res, data);
    } catch (error) {
      next(error);
    }
  }
}
