import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { Prisma } from '../../generated/prisma/client';
import { ErrorCode } from './error-code';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let errorMessage = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        errorMessage = body;
      } else if (typeof body === 'object' && body !== null) {
        if ('errorCode' in body && typeof body.errorCode === 'string') {
          errorCode = body.errorCode as ErrorCode;
        }
        if ('message' in body) {
          const message = body.message;
          errorMessage = Array.isArray(message)
            ? message.join(', ')
            : String(message);
        }
      }

      if (status === HttpStatus.NOT_FOUND) {
        errorCode = ErrorCode.NOT_FOUND;
      } else if (status === HttpStatus.UNAUTHORIZED) {
        errorCode = ErrorCode.UNAUTHORIZED;
      } else if (status === HttpStatus.BAD_REQUEST) {
        errorCode =
          errorCode === ErrorCode.INTERNAL_ERROR
            ? ErrorCode.VALIDATION_ERROR
            : errorCode;
      }
    } else if (
      exception instanceof Prisma.PrismaClientKnownRequestError &&
      exception.code === 'P2002'
    ) {
      status = HttpStatus.CONFLICT;
      errorCode = ErrorCode.CONFLICT;
      errorMessage = 'A row with this key already exists';
    } else {
      this.logger.error(exception);
    }

    if (status >= 500 && exception instanceof HttpException) {
      this.logger.error(exception);
    }

    response.status(status).json({
      errorCode,
      errorMessage,
    });
  }
}
