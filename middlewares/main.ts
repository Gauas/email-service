import crypto from "node:crypto";

import express from "express";
import type { Express, NextFunction, Request, Response } from "express";

import type { Config } from "@/config/main.js";
import type { RequestContext } from "@/middlewares/context.js";
import { Fail } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";

const JSON_BODY_LIMIT = "1mb";

export class Middleware {
  constructor(private readonly Config: Config) {}

  RegisterGlobal(server: Express): void {
    server.use((req: Request, res: Response, next: NextFunction) => {
      const startedAt = Date.now();
      const requestId = crypto.randomUUID();

      res.locals.context = { requestId } satisfies RequestContext;
      res.setHeader("x-request-id", requestId);

      res.on("finish", () => {
        console.log(
          JSON.stringify({
            request_id: requestId,
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration_ms: Date.now() - startedAt
          })
        );
      });

      next();
    });

    server.use(express.json({ limit: JSON_BODY_LIMIT }));
  }

  Internal() {
    return (req: Request, _res: Response, next: NextFunction): void => {
      if (this.Config.InternalApiKey === "") {
        next();
        return;
      }

      if (req.header("x-api-key") !== this.Config.InternalApiKey) {
        next(Fail(HttpStatus.UNAUTHORIZED, "unauthorized"));
        return;
      }

      next();
    };
  }
}

export function New(config: Config): Middleware {
  return new Middleware(config);
}
