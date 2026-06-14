import { injectable } from 'inversify';

@injectable()
export class UserService {
  // TODO: implement findById - fetch user from UserModel
  async findById(_id: string) {
    throw new Error('Not implemented');
  }

  // TODO: implement findByEmail - fetch user from UserModel
  async findByEmail(_email: string) {
    throw new Error('Not implemented');
  }
}
