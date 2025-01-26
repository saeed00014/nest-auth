import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

import { Request, Response } from 'express';

import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMErrorFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(500).json({
      statusCode: 500,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
