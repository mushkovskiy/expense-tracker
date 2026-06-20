import { createCategorySchema, updateCategorySchema } from '@repo/validation';
import type { Response } from 'express';
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
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { validateBody } from '../../middleware/validate.middleware';
import type { CategoryService } from './category.service';


@controller('/categories', AuthMiddleware)
export class CategoryController {
  constructor(@inject(TYPES.CategoryService) private readonly categoryService: CategoryService) {}

  @httpGet('/')
  async list(@response() res: Response) {
    // TODO: call categoryService.list using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPost('/', validateBody(createCategorySchema))
  async create(@requestBody() _body: unknown, @response() res: Response) {
    // TODO: call categoryService.create using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpPut('/:id', validateBody(updateCategorySchema))
  async update(
    @requestParam('id') _id: string,
    @requestBody() _body: unknown,
    @response() res: Response,
  ) {
    // TODO: call categoryService.update using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }

  @httpDelete('/:id')
  async remove(@requestParam('id') _id: string, @response() res: Response) {
    // TODO: call categoryService.remove using req.user.sub
    res.status(501).json({ success: false, error: { message: 'Not implemented' } });
  }
}
