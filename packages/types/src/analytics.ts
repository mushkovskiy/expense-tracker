export interface IMonthlyTotal {
  month: string;
  total: number;
}

export interface ICategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  total: number;
}

export interface IExpenseOverview {
  monthlyTotals: IMonthlyTotal[];
  byCategory: ICategoryTotal[];
  totalSpent: number;
  avgPerMonth: number;
  previousPeriodTotal: number;
  currency: string;
}
