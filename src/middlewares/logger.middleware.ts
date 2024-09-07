import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const timestampStart = new Date();

    res.on('finish', () => {
      console.log('Request log', {
        requestStart: timestampStart,
        requestEnd: new Date(),
        method: req.method,
        route: req.url,
      });
    });

    next();
  }
}
