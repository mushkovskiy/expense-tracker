const TYPES = {
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  ExpenseService: Symbol.for('ExpenseService'),
  CategoryService: Symbol.for('CategoryService'),
  BudgetService: Symbol.for('BudgetService'),
  AnalyticsService: Symbol.for('AnalyticsService'),
} as const;

export { TYPES };
