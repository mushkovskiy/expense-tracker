import type { Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, response } from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import type { UserService } from './user.service';


@controller('/users', AuthMiddleware)
export class UserController {
  constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

  @httpGet('/me')
  async getMe(@response() res: Response) {
    // TODO: call userService.findById using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }
}
