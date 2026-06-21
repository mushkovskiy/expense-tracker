import { categoryQuerySchema, createCategorySchema, updateCategorySchema } from '@repo/validation';
import type {
  CategoryQueryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@repo/validation';
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
import type { CategoryService } from './category.service';

@controller('/categories', AuthMiddleware)
export class CategoryController {
  constructor(@inject(TYPES.CategoryService) private readonly categoryService: CategoryService) {}

  @httpGet('/', validateQuery(categoryQuerySchema))
  async list(@request() req: Request, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const query = req.query as unknown as CategoryQueryInput;
    const result = await this.categoryService.list(userId, query);
    res.status(200).json({ success: true, data: result });
  }

  @httpPost('/', validateBody(createCategorySchema))
  async create(
    @request() req: Request,
    @requestBody() body: CreateCategoryInput,
    @response() res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const category = await this.categoryService.create(userId, body);
    res.status(201).json({ success: true, data: { category } });
  }

  @httpPut('/:id', validateBody(updateCategorySchema))
  async update(
    @request() req: Request,
    @requestParam('id') id: string,
    @requestBody() body: UpdateCategoryInput,
    @response() res: Response,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const category = await this.categoryService.update(userId, id, body);
    res.status(200).json({ success: true, data: { category } });
  }

  @httpDelete('/:id')
  async remove(@request() req: Request, @requestParam('id') id: string, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    await this.categoryService.remove(userId, id);
    res.status(200).json({ success: true, data: { success: true } });
  }
}
