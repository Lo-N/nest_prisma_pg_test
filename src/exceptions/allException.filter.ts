import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UserErrorMessages } from 'src/utils/userErrorMessages.utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    console.error('An exception was caught!', exception);

    const responseBody = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: UserErrorMessages.INTERNAL_SERVER_ERROR(),
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
