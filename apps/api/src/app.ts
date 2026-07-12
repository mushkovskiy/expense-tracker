import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { env } from './config/env';
import { container } from './container/container';
import { errorMiddleware } from './middleware/error.middleware';

// Import controllers so they register themselves via decorators
import './modules/auth/auth.controller';
import './modules/users/user.controller';
import './modules/expenses/expense.controller';
import './modules/categories/category.controller';
import './modules/budgets/budget.controller';
import './modules/analytics/analytics.controller';

const server = new InversifyExpressServer(container, null, { rootPath: '/api' });

server.setConfig((app) => {
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(express.json());
});

server.setErrorConfig((app) => {
  app.use(errorMiddleware);
});

export const app = server.build();
