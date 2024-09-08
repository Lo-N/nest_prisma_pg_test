import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    let responseData;

    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'object') {
      responseData = exceptionResponse;
    } else {
      responseData = { error: exceptionResponse };
    }

    response.status(status).json({
      ...responseData,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
