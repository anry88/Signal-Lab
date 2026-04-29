import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { MetricsService } from './metrics.service';

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  constructor(private readonly metrics: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      this.metrics.httpRequestsTotal.inc({
        method: req.method,
        path: req.path || 'unknown',
        status_code: String(res.statusCode),
      });
    });

    next();
  }
}
