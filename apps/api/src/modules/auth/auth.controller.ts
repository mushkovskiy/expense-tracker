import { loginSchema, registerSchema } from '@repo/validation';
import type { LoginInput, RegisterInput } from '@repo/validation';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  request,
  requestBody,
  response,
} from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { clearAuthCookie, setAuthCookie } from '../../utils/cookie';
import type { AuthService } from './auth.service';

@controller('/auth')
export class AuthController {
  constructor(@inject(TYPES.AuthService) private readonly authService: AuthService) {}

  @httpPost('/register', validateBody(registerSchema))
  async register(@requestBody() body: RegisterInput, @response() res: Response) {
    const { user, token } = await this.authService.register(body);
    setAuthCookie(res, token);
    res.status(201).json({ success: true, data: { user } });
  }

  @httpPost('/login', validateBody(loginSchema))
  async login(@requestBody() body: LoginInput, @response() res: Response) {
    const { user, token } = await this.authService.login(body);
    setAuthCookie(res, token);
    res.status(200).json({ success: true, data: { user } });
  }

  @httpPost('/logout')
  async logout(@response() res: Response) {
    clearAuthCookie(res);
    res.status(200).json({ success: true, data: { success: true } });
  }

  @httpGet('/me', AuthMiddleware)
  async me(@request() req: Request, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
      return;
    }
    const user = await this.authService.getCurrentUser(userId);
    res.status(200).json({ success: true, data: { user } });
  }
}
