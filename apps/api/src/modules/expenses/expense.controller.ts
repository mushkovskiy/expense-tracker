import { createExpenseSchema, updateExpenseSchema } from '@repo/validation';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import type { Response } from 'express';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import { ExpenseService } from './expense.service';

@controller('/expenses', AuthMiddleware)
export class ExpenseController {
  constructor(@inject(TYPES.ExpenseService) private readonly expenseService: ExpenseService) {}

  @httpGet('/')
  async list(@response() res: Response) {
    // TODO: call expenseService.list using req.user.sub and query params for pagination
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPost('/', validateBody(createExpenseSchema))
  async create(@requestBody() _body: unknown, @response() res: Response) {
    // TODO: call expenseService.create using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPut('/:id', validateBody(updateExpenseSchema))
  async update(
    @requestParam('id') _id: string,
    @requestBody() _body: unknown,
    @response() res: Response,
  ) {
    // TODO: call expenseService.update using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpDelete('/:id')
  async remove(@requestParam('id') _id: string, @response() res: Response) {
    // TODO: call expenseService.remove using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }
}
