import type { IExpense } from '@repo/types';
import type { DocumentType } from '@typegoose/typegoose';
import type { Expense } from '../../models/expense.model';

export function toIExpense(doc: DocumentType<Expense>): IExpense {
  return {
    id: doc._id.toString(),
    userId: doc.user.toString(),
    categoryId: doc.category.toString(),
    amount: doc.amount,
    currency: doc.currency,
    description: doc.description,
    date: new Date(doc.date).toISOString(),
    createdAt: new Date(doc.createdAt ?? 0).toISOString(),
    updatedAt: new Date(doc.updatedAt ?? 0).toISOString(),
  };
}
