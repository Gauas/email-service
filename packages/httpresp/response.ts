import type { Response } from "express";
import { HttpStatus } from "@/packages/httpresp/status.js";

export function success(res: Response, data: unknown): void {
  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    data
  });
}

export function created(res: Response, data: unknown): void {
  res.status(HttpStatus.CREATED).json({
    status: HttpStatus.CREATED,
    data
  });
}

export function message(res: Response, message: string): void {
  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    data: {
      message
    }
  });
}
