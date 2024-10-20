import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as winston from 'winston';
import { MESSAGES } from '@nestjs/core/constants';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter<T = any> implements ExceptionFilter {
  constructor(private readonly logger: winston.Logger) {}

  catch(exception, host: ArgumentsHost) {
    let res: { statusCode: number; message: any } & any;

    this.logger.error(exception);
    if (
      exception &&
      (exception.getResponse || exception.response) &&
      exception.getStatus
    ) {
      res = this.handleHttpException(exception);
      this.logErrorLogger(exception, host.switchToHttp().getRequest());
    } else {
      res = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
      };
      this.logger.error('Server error: ', { exception: exception.toString() });
    }

    if (host.getType() === 'rpc') {
      return throwError(
        () =>
          new RpcException({
            statusCode: res.statusCode,
            message: res.message,
          }),
      );
    }

    host.switchToHttp().getResponse().status(res.statusCode).json(res);
  }

  public handleHttpException(
    exception,
  ): { statusCode: number; message: any } & any {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errRes;
    try {
      errRes = exception.getResponse
        ? exception.getResponse()
        : exception.response;
      statusCode = exception.getStatus();
    } catch (e) {
      this.logger.error(exception);
    }

    const isStringMessage = typeof errRes?.message === 'string';
    const isArrayMessage = Array.isArray(errRes?.message);

    let error = 'サーバー内部エラー。';
    let message: string[] = [error];

    if (statusCode !== 500 && isStringMessage) {
      message = [errRes.message];
      error = errRes.error ?? errRes.message;
    } else if (isArrayMessage) {
      message = errRes.message;
      error = errRes.error;
    }

    return {
      statusCode,
      message,
      error,
      ...(errRes?.data && { data: errRes?.data }),
    };
  }

  public logErrorLogger(exception: T & HttpException, request: any) {
    this.logger.error(`${exception.name}: ${exception.message}`, {
      user: (request as any)?.user,
      request: {
        method: request.method,
        url: request.url,
        body: request.body,
        query: request.query,
        authorization: request.headers?.authorization,
      },
      exception: exception.getResponse(),
      stack: exception.stack,
    });
  }
}
