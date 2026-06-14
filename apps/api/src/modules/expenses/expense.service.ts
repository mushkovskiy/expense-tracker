import type { CreateExpenseInput, UpdateExpenseInput } from '@repo/validation';
import { injectable } from 'inversify';

@injectable()
export class ExpenseService {
  // TODO: implement list - return paginated expenses for the given user
  async list(_userId: string) {
    throw new Error('Not implemented');
  }

  // TODO: implement create - create an expense for the given user
  async create(_userId: string, _dto: CreateExpenseInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement update - update an expense owned by the user
  async update(_userId: string, _id: string, _dto: UpdateExpenseInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement remove - delete an expense owned by the user
  async remove(_userId: string, _id: string) {
    throw new Error('Not implemented');
  }
}
