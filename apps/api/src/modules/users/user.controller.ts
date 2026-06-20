import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { HttpError } from '../../middleware/error.middleware';
import { toIUser } from './user.mapper';
import type { UserService } from './user.service';

@controller('/users', AuthMiddleware)
export class UserController {
  constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

  @httpGet('/me')
  async getMe(@request() req: Request, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.status(200).json({ success: true, data: { user: toIUser(user) } });
  }
}
