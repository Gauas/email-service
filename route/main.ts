import type { Express, Request, Response } from "express";
import { Router } from "express";

import type { Controller } from "@/controller/main.js";
import type { Middleware } from "@/middlewares/main.js";
import { Ok } from "@/packages/httpresp/response.js";

export class Route {
  constructor(
    private readonly Server: Express,
    private readonly Controller: Controller,
    private readonly Middleware: Middleware
  ) {}

  RegisterRoutes(): void {
    const health = Router();
    health.get("/v1/email/health", (_req: Request, res: Response) => {
      Ok(res, { status: "ok" });
    });

    const api = Router();
    api.post("/v1/email/send", this.Middleware.Internal(), this.Controller.Mail.Send.bind(this.Controller.Mail));

    this.Server.use(health);
    this.Server.use(api);
  }
}

export function New(server: Express, controller: Controller, middleware: Middleware): Route {
  return new Route(server, controller, middleware);
}
