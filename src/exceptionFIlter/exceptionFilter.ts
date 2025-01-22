import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { TypeOrmQueryFailedErrors } from './typeormQueryFailedErros';

export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    if (exception instanceof TypeORMError) {
      if (exception instanceof QueryFailedError) {
        const unknownDriverError: any = exception.driverError;
        const unknownDriverErrorCode: any = unknownDriverError.code;
        if (unknownDriverErrorCode === TypeOrmQueryFailedErrors.ER_DUP_ENTRY) {
          return response.status(500).json({
            statusCode: 500,
            message: '',
            timestamp: new Date().toISOString(),
            path: request.url,
          });
        }
      }
    }
  }
}
