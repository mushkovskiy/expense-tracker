import type { LoginInput, RegisterInput } from '@repo/validation';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../container/types';
import { HttpError } from '../../middleware/error.middleware';
import { signAccessToken } from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';
import { toIUser } from '../users/user.mapper';
import type { UserService } from '../users/user.service';

@injectable()
export class AuthService {
  constructor(@inject(TYPES.UserService) private readonly userService: UserService) {}

  async register(dto: RegisterInput) {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new HttpError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userService.create({ email: dto.email, passwordHash, name: dto.name });
    const iUser = toIUser(user);
    const token = signAccessToken({ sub: iUser.id, email: iUser.email });

    return { user: iUser, token };
  }

  async login(dto: LoginInput) {
    const user = await this.userService.findByEmail(dto.email);
    const valid = user ? await comparePassword(dto.password, user.passwordHash) : false;

    if (!user || !valid) {
      throw new HttpError(401, 'Invalid credentials');
    }

    const iUser = toIUser(user);
    const token = signAccessToken({ sub: iUser.id, email: iUser.email });

    return { user: iUser, token };
  }

  async getCurrentUser(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new HttpError(401, 'Unauthorized');
    }
    return toIUser(user);
  }
}
