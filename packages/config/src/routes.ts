export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id: string) => `/expenses/${id}`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  BUDGETS: {
    BASE: '/budgets',
    BY_ID: (id: string) => `/budgets/${id}`,
  },
} as const;
