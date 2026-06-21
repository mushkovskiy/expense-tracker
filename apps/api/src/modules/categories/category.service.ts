import type {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@repo/validation';
import { injectable } from 'inversify';
import { HttpError } from '../../middleware/error.middleware';
import { CategoryModel } from '../../models/category.model';
import { toICategory } from './category.mapper';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

@injectable()
export class CategoryService {
  async list(userId: string, query: CategoryQueryInput) {
    const { search, page, pageSize } = query;

    const filter: Record<string, unknown> = { user: userId };
    if (search) {
      filter.name = { $regex: escapeRegExp(search), $options: 'i' };
    }

    const [items, total] = await Promise.all([
      CategoryModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      CategoryModel.countDocuments(filter),
    ]);

    return {
      items: items.map(toICategory),
      total,
      page,
      pageSize,
    };
  }

  async create(userId: string, dto: CreateCategoryInput) {
    const existing = await CategoryModel.findOne({ user: userId, name: dto.name });
    if (existing) {
      throw new HttpError(409, 'Category name already exists');
    }

    const category = await CategoryModel.create({ user: userId, ...dto });

    return toICategory(category);
  }

  async update(userId: string, id: string, dto: UpdateCategoryInput) {
    if (dto.name) {
      const existing = await CategoryModel.findOne({
        user: userId,
        name: dto.name,
        _id: { $ne: id },
      });
      if (existing) {
        throw new HttpError(409, 'Category name already exists');
      }
    }

    const category = await CategoryModel.findOneAndUpdate({ _id: id, user: userId }, dto, {
      new: true,
    });
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }
    return toICategory(category);
  }

  async remove(userId: string, id: string) {
    const category = await CategoryModel.findOneAndDelete({ _id: id, user: userId });
    if (!category) {
      throw new HttpError(404, 'Category not found');
    }
  }
}
