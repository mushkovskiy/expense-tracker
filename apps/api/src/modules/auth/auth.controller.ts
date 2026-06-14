import { loginSchema, registerSchema } from '@repo/validation';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  requestBody,
  response,
} from 'inversify-express-utils';
import type { Request, Response } from 'express';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { AuthService } from './auth.service';

@controller('/auth')
export class AuthController {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  @httpPost('/register', validateBody(registerSchema))
  async register(@requestBody() _body: unknown, @response() res: Response) {
    // TODO: call authService.register, set httpOnly cookie with access token
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPost('/login', validateBody(loginSchema))
  async login(@requestBody() _body: unknown, @response() res: Response) {
    // TODO: call authService.login, set httpOnly cookie with access token
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPost('/logout')
  async logout(@response() res: Response) {
    // TODO: clear access token cookie
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpGet('/me', AuthMiddleware)
  async me(@request() req: Request, @response() res: Response) {
    // TODO: call authService.getCurrentUser using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }
}
