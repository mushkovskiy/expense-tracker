import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.accessToken as string | undefined;

    if (!token) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }

    try {
      req.user = verifyAccessToken(token);
      next();
    } catch {
      res.status(401).json({ success: false, error: { message: 'Invalid or expired token' } });
    }
  }
}
