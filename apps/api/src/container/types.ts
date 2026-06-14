const TYPES = {
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  ExpenseService: Symbol.for('ExpenseService'),
  CategoryService: Symbol.for('CategoryService'),
  BudgetService: Symbol.for('BudgetService'),
} as const;

export { TYPES };
