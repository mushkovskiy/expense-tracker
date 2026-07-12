import { analyticsQuerySchema } from '@repo/validation';
import type { AnalyticsQueryInput } from '@repo/validation';
import type { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, request, response } from 'inversify-express-utils';
import { TYPES } from '../../container/types';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { HttpError } from '../../middleware/error.middleware';
import { validateQuery } from '../../middleware/validate.middleware';
import type { AnalyticsService } from './analytics.service';

@controller('/analytics', AuthMiddleware)
export class AnalyticsController {
  constructor(
    @inject(TYPES.AnalyticsService) private readonly analyticsService: AnalyticsService,
  ) {}

  @httpGet('/overview', validateQuery(analyticsQuerySchema))
  async overview(@request() req: Request, @response() res: Response) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new HttpError(401, 'Unauthorized');
    }
    const query = req.query as unknown as AnalyticsQueryInput;
    const result = await this.analyticsService.overview(userId, query);
    res.status(200).json({ success: true, data: result });
  }
}
