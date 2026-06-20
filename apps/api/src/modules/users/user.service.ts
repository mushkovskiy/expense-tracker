import { injectable } from 'inversify';
import { UserModel } from '../../models/user.model';

@injectable()
export class UserService {
  async findById(id: string) {
    return UserModel.findById(id);
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async create(data: { email: string; passwordHash: string; name: string }) {
    return UserModel.create(data);
  }
}
