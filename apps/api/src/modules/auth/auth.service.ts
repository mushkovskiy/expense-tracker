import { injectable } from 'inversify';
import type { LoginInput, RegisterInput } from '@repo/validation';

@injectable()
export class AuthService {
  // TODO: implement register - hash password, create user, return user + token
  async register(_dto: RegisterInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement login - verify credentials, sign JWT
  async login(_dto: LoginInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement getCurrentUser - fetch user by id from token payload
  async getCurrentUser(_userId: string) {
    throw new Error('Not implemented');
  }
}
