import express, { type NextFunction, type Request, type Response } from "express";

import type { Config } from "@/config/main.js";
import type { Controller } from "@/controller/main.js";
import type { Middleware } from "@/middlewares/main.js";
import { ErrorBody, type ErrorLike } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";
import { New as newRoute } from "@/route/main.js";

export class Kernel {
  constructor(
    private readonly Controller: Controller,
    private readonly Middleware: Middleware,
    private readonly Config: Config
  ) {}

  Start(): void {
    const server = express();
    server.disable("x-powered-by");

    this.Middleware.RegisterGlobal(server);
    newRoute(server, this.Controller, this.Middleware).RegisterRoutes();

    server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      const httpError = err as ErrorLike;

      if (typeof httpError.Code === "number") {
        res.status(httpError.Code).json(ErrorBody(httpError.Code, httpError.Message));
        return;
      }

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(ErrorBody(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error"));
    });

    server.listen(this.Config.Port, () => {
      console.log(`${this.Config.ServiceName} listening on :${this.Config.Port}`);
    });
  }
}

export function New(controller: Controller, middleware: Middleware, config: Config): Kernel {
  return new Kernel(controller, middleware, config);
}
