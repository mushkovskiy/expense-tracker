export interface IExpense {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  currency: string;
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  categoryId: string;
  amount: number;
  currency: string;
  description?: string;
  date: string;
}

export interface UpdateExpenseDto {
  categoryId?: string;
  amount?: number;
  currency?: string;
  description?: string;
  date?: string;
}
