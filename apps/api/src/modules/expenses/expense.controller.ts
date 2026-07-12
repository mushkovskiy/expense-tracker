import { createExpenseSchema, expenseQuerySchema, updateExpenseSchema } from '@repo/validation';
import type { CreateExpenseInput, ExpenseQueryInput, UpdateExpenseInput } from '@repo/validation';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { HttpError } from '../../middleware/error.middleware';
import { validateBody, validateQuery } from '../../middleware/validate.middleware';
import type { ExpenseService } from './expense.service';

@controller('/expenses', AuthMiddleware)
export class ExpenseController {
  constructor(@inject(TYPES.ExpenseService) private readonly expenseService: ExpenseService) {}

  @httpGet('/', validateQuery(expenseQuerySchema))
  async list(@request() req: Request, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const query = req.query as unknown as ExpenseQueryInput;
    const result = await this.expenseService.list(userId, query);
    res.status(200).json({ success: true, data: result });
  }

  @httpPost('/', validateBody(createExpenseSchema))
  async create(
    @request() req: Request,
    @requestBody() body: CreateExpenseInput,
    @response() res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const expense = await this.expenseService.create(userId, body);
    res.status(201).json({ success: true, data: { expense } });
  }

  @httpPut('/:id', validateBody(updateExpenseSchema))
  async update(
    @request() req: Request,
    @requestParam('id') id: string,
    @requestBody() body: UpdateExpenseInput,
    @response() res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const expense = await this.expenseService.update(userId, id, body);
    res.status(200).json({ success: true, data: { expense } });
  }

  @httpDelete('/:id')
  async remove(@request() req: Request, @requestParam('id') id: string, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    await this.expenseService.remove(userId, id);
    res.status(200).json({ success: true, data: { success: true } });
  }
}
