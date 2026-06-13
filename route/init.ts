import type { Express, Request, Response } from "express";
import { Router } from "express";

import type { Controller } from "@/controller/init.js";
import type { Middleware } from "@/middlewares/init.js";
import * as http from "@/packages/httpresp/response.js";

export function Init(app: Express, ctrl: Controller, mw: Middleware): Route {
  return new Route(app, ctrl, mw);
}

export class Route {
  constructor(
    private readonly app: Express,
    private readonly ctrl: Controller,
    private readonly mw: Middleware
  ) {}

  RegisterRoutes(): void {
    const health = Router();

    health.get("/v1/email/health", (_req: Request, res: Response) => {
      http.success(res, { status: "ok" });
    });

    const api = Router();

    api.post("/v1/email/send", this.mw.Internal(), this.ctrl.Mail.Send.bind(this.ctrl.Mail));

    this.app.use(health);

    this.app.use(api);
  }
}
