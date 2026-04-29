import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let customPayload: Record<string, unknown> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        customPayload = {
          ...res,
          statusCode: (res as { statusCode?: number }).statusCode ?? status,
          timestamp:
            (res as { timestamp?: string }).timestamp ??
            new Date().toISOString(),
          path: (res as { path?: string }).path ?? request.url,
        };
        message = String(
          (customPayload.message as string | undefined) ?? message,
        );
      } else if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray((res as { message?: unknown }).message)) {
        message = (res as { message: unknown[] }).message.join(', ');
      } else if (
        typeof (res as { message?: unknown }).message === 'string' &&
        (res as { message?: unknown }).message
      ) {
        message = (res as { message: string }).message;
      } else if (exception.message) {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    // Keep logs machine-readable; Loki/Promtail can be added in later phases.
    console.error(
      JSON.stringify({
        level: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'warn',
        msg: 'request failed',
        path: request.url,
        method: request.method,
        statusCode: status,
        message,
      }),
    );

    const payload = customPayload ?? {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(payload);
  }
}
