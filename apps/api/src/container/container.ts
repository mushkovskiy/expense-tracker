import { Container } from 'inversify';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { AnalyticsService } from '../modules/analytics/analytics.service';
import { AuthService } from '../modules/auth/auth.service';
import { BudgetService } from '../modules/budgets/budget.service';
import { CategoryService } from '../modules/categories/category.service';
import { ExpenseService } from '../modules/expenses/expense.service';
import { UserService } from '../modules/users/user.service';
import { TYPES } from './types';

const container = new Container();

container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<ExpenseService>(TYPES.ExpenseService).to(ExpenseService).inSingletonScope();
container.bind<CategoryService>(TYPES.CategoryService).to(CategoryService).inSingletonScope();
container.bind<BudgetService>(TYPES.BudgetService).to(BudgetService).inSingletonScope();
container.bind<AnalyticsService>(TYPES.AnalyticsService).to(AnalyticsService).inSingletonScope();

container.bind<AuthMiddleware>(AuthMiddleware).toSelf();

export { container };
