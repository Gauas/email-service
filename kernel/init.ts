import express, { type NextFunction, type Request, type Response } from "express";

import type { Config } from "@/config/init.js";
import type { Controller } from "@/controller/init.js";
import type { Middleware } from "@/middlewares/init.js";
import { errorBody, type ErrorLike } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";
import { Init as initRoute } from "@/route/init.js";

export function Init(ctrl: Controller, mw: Middleware, config: Config): Kernel {
  return new Kernel(ctrl, mw, config);
}

export class Kernel {
  constructor(
    private readonly ctrl: Controller,
    private readonly mw: Middleware,
    private readonly config: Config
  ) {}

  Start(): void {
    const server = express();

    server.disable("x-powered-by");

    this.mw.RegisterGlobal(server);

    initRoute(server, this.ctrl, this.mw).RegisterRoutes();

    server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      const httpError = err as ErrorLike;

      if (typeof httpError.code === "number") {
        res.status(httpError.code).json(errorBody(httpError.code, httpError.message));

        return;
      }

      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json(errorBody(HttpStatus.INTERNAL_SERVER_ERROR, "internal server error"));
    });

    server.listen(this.config.Port, () => {
      console.log(`${this.config.ServiceName} listening on :${this.config.Port}`);
    });
  }
}
