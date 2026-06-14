import type { CreateCategoryInput, UpdateCategoryInput } from '@repo/validation';
import { injectable } from 'inversify';

@injectable()
export class CategoryService {
  // TODO: implement list - return categories for the given user
  async list(_userId: string) {
    throw new Error('Not implemented');
  }

  // TODO: implement create - create a category for the given user
  async create(_userId: string, _dto: CreateCategoryInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement update - update a category owned by the user
  async update(_userId: string, _id: string, _dto: UpdateCategoryInput) {
    throw new Error('Not implemented');
  }

  // TODO: implement remove - delete a category owned by the user
  async remove(_userId: string, _id: string) {
    throw new Error('Not implemented');
  }
}
