import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const endpoint = req.originalUrl;
    const requestBody = JSON.stringify(req.body);

    console.log(
      `[${timestamp}] (${method}) URL: ${endpoint} || Request Body: ${requestBody}`,
    );

    next();
  }
}
