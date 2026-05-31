export type ErrorLike = Error & {
  Code: number;
  Message: string;
};

export class AppError extends Error {
  Code: number;
  Message: string;

  constructor(code: number, message: string) {
    super(message);
    this.Code = code;
    this.Message = message;
  }
}

export function Fail(code: number, message: string): AppError {
  return new AppError(code, message);
}

export function ErrorBody(status: number, message: string) {
  return {
    status,
    error: message
  };
}
