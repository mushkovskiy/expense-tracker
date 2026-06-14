import type { NextFunction, Request, Response } from 'express';

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof HttpError ? err.message : 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: { message },
  });
}
