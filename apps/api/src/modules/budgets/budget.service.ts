import type { CreateBudgetInput, UpdateBudgetInput } from '@repo/validation';
import { injectable } from 'inversify';

@injectable()
export class BudgetService {
  // TODO: implement list - return budgets for the given user
  async list(_userId: string) {
    throw new Error('Not implemented');
  }

  // TODO: implement create - create a budget for the given user
  async create(_userId: string, _dto: CreateBudgetInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement update - update a budget owned by the user
  async update(_userId: string, _id: string, _dto: UpdateBudgetInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement remove - delete a budget owned by the user
  async remove(_userId: string, _id: string) {
    throw new Error('Not implemented');
  }
}
