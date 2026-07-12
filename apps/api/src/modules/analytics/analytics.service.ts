import type { ICategoryTotal, IExpenseOverview, IMonthlyTotal } from '@repo/types';
import type { AnalyticsQueryInput } from '@repo/validation';
import { injectable } from 'inversify';
import { Types } from 'mongoose';
import { ExpenseModel } from '../../models/expense.model';

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

interface MonthlyAggRow {
  _id: { year: number; month: number };
  total: number;
}

interface CategoryAggRow {
  categoryId: Types.ObjectId;
  name: string;
  color: string;
  total: number;
}

@injectable()
export class AnalyticsService {
  async overview(userId: string, query: AnalyticsQueryInput): Promise<IExpenseOverview> {
    const { months, currency } = query;

    const now = new Date();
    const currentStart = startOfMonth(addMonths(now, -(months - 1)));
    const currentEnd = addMonths(now, 1);
    const previousStart = addMonths(currentStart, -months);
    const previousEnd = currentStart;

    const userObjectId = new Types.ObjectId(userId);
    const baseMatch = { user: userObjectId, currency };

    const [monthlyAgg, categoryAgg, previousAgg] = await Promise.all([
      ExpenseModel.aggregate<MonthlyAggRow>([
        { $match: { ...baseMatch, date: { $gte: currentStart, $lt: currentEnd } } },
        {
          $group: {
            _id: { year: { $year: '$date' }, month: { $month: '$date' } },
            total: { $sum: '$amount' },
          },
        },
      ]),
      ExpenseModel.aggregate<CategoryAggRow>([
        { $match: { ...baseMatch, date: { $gte: currentStart, $lt: currentEnd } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: '$category' },
        {
          $project: {
            _id: 0,
            categoryId: '$_id',
            name: '$category.name',
            color: '$category.color',
            total: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),
      ExpenseModel.aggregate<{ total: number }>([
        { $match: { ...baseMatch, date: { $gte: previousStart, $lt: previousEnd } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    const monthlyByKey = new Map(
      monthlyAgg.map((row) => [monthKey(row._id.year, row._id.month), row.total]),
    );

    const monthlyTotals: IMonthlyTotal[] = [];
    for (let i = 0; i < months; i += 1) {
      const cursor = addMonths(currentStart, i);
      const key = monthKey(cursor.getFullYear(), cursor.getMonth() + 1);
      monthlyTotals.push({ month: key, total: monthlyByKey.get(key) ?? 0 });
    }

    const byCategory: ICategoryTotal[] = categoryAgg.map((row) => ({
      categoryId: row.categoryId.toString(),
      name: row.name,
      color: row.color,
      total: row.total,
    }));

    const totalSpent = monthlyTotals.reduce((sum, row) => sum + row.total, 0);
    const avgPerMonth = totalSpent / months;
    const previousPeriodTotal = previousAgg[0]?.total ?? 0;

    return {
      monthlyTotals,
      byCategory,
      totalSpent,
      avgPerMonth,
      previousPeriodTotal,
      currency,
    };
  }
}
