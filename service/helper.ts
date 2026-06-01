import { ZodError } from "zod";

import { Fail } from "@/packages/httpresp/errors.js";
import { HttpStatus } from "@/packages/httpresp/status.js";

const FIRST_ISSUE_INDEX = 0;

export function appError(code: number, message: string) {
  return Fail(code, message);
}

export function mapValidationError(error: unknown): never {
  if (error instanceof ZodError) {
    const first = error.issues[FIRST_ISSUE_INDEX];
    throw appError(HttpStatus.BAD_REQUEST, first?.message ?? "invalid request");
  }

  throw error;
}
