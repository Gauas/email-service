export type ErrorLike = Error & {
  code: number;
  message: string;
};

export class AppError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export function fail(code: number, message: string): AppError {
  return new AppError(code, message);
}

export function errorBody(status: number, message: string) {
  return {
    status,
    error: message
  };
}
