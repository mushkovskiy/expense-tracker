import type { CreateExpenseInput, ExpenseQueryInput, UpdateExpenseInput } from '@repo/validation';
import { injectable } from 'inversify';
import { HttpError } from '../../middleware/error.middleware';
import { CategoryModel } from '../../models/category.model';
import { ExpenseModel } from '../../models/expense.model';
import { toIExpense } from './expense.mapper';

async function assertCategoryOwnership(userId: string, categoryId: string): Promise<void> {
  const category = await CategoryModel.findOne({ _id: categoryId, user: userId });
  if (!category) {
    throw new HttpError(404, 'Category not found');
  }
}

@injectable()
export class ExpenseService {
  async list(userId: string, query: ExpenseQueryInput) {
    const { categoryId, from, to, search, page, pageSize } = query;

    const filter: Record<string, unknown> = { user: userId };
    if (categoryId) {
      filter.category = categoryId;
    }
    if (from || to) {
      const date: Record<string, Date> = {};
      if (from) date.$gte = new Date(from);
      if (to) date.$lte = new Date(to);
      filter.date = date;
    }
    if (search) {
      filter.description = { $regex: search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      ExpenseModel.find(filter)
        .sort({ date: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      ExpenseModel.countDocuments(filter),
    ]);

    return {
      items: items.map(toIExpense),
      total,
      page,
      pageSize,
    };
  }

  async create(userId: string, dto: CreateExpenseInput) {
    await assertCategoryOwnership(userId, dto.categoryId);

    const expense = await ExpenseModel.create({
      user: userId,
      category: dto.categoryId,
      amount: dto.amount,
      currency: dto.currency,
      description: dto.description,
      date: new Date(dto.date),
    });

    return toIExpense(expense);
  }

  async update(userId: string, id: string, dto: UpdateExpenseInput) {
    if (dto.categoryId) {
      await assertCategoryOwnership(userId, dto.categoryId);
    }

    const { categoryId, date, ...rest } = dto;
    const update: Record<string, unknown> = { ...rest };
    if (categoryId) {
      update.category = categoryId;
    }
    if (date) {
      update.date = new Date(date);
    }

    const expense = await ExpenseModel.findOneAndUpdate({ _id: id, user: userId }, update, {
      new: true,
    });
    if (!expense) {
      throw new HttpError(404, 'Expense not found');
    }
    return toIExpense(expense);
  }

  async remove(userId: string, id: string) {
    const expense = await ExpenseModel.findOneAndDelete({ _id: id, user: userId });
    if (!expense) {
      throw new HttpError(404, 'Expense not found');
    }
  }
}
