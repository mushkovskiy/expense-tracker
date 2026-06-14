import { createBudgetSchema, updateBudgetSchema } from '@repo/validation';
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
import { BudgetService } from './budget.service';

@controller('/budgets', AuthMiddleware)
export class BudgetController {
  constructor(@inject(TYPES.BudgetService) private readonly budgetService: BudgetService) {}

  @httpGet('/')
  async list(@response() res: Response) {
    // TODO: call budgetService.list using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPost('/', validateBody(createBudgetSchema))
  async create(@requestBody() _body: unknown, @response() res: Response) {
    // TODO: call budgetService.create using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPut('/:id', validateBody(updateBudgetSchema))
  async update(
    @requestParam('id') _id: string,
    @requestBody() _body: unknown,
    @response() res: Response,
  ) {
    // TODO: call budgetService.update using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpDelete('/:id')
  async remove(@requestParam('id') _id: string, @response() res: Response) {
    // TODO: call budgetService.remove using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }
}
