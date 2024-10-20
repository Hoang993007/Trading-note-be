import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ESort, IPagination } from 'src/shares/shared.interface';
import { BaseException } from '../exceptions/base.exception';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

function isIntNumberStringReg(str: string): boolean {
  return new RegExp(/^-?[0-9]+$/).test(str);
}

export const ApiPaginationQuery = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: `Page number, default: ${DEFAULT_PAGE}`,
      example: DEFAULT_PAGE,
      type: Number,
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      description: `Number items per page, default: ${DEFAULT_LIMIT}`,
      example: DEFAULT_LIMIT,
      type: Number,
    }),
  );
};

const createPagination = (
  pageStr: string,
  limitStr: string,
): { page: number; limit: number } => {
  let page: number;
  let limit: number;

  if (pageStr === undefined || pageStr === null) {
    page = DEFAULT_PAGE;
  } else {
    if (!isIntNumberStringReg(pageStr)) {
      throw new BaseException(
        'Page and limit must be an integer number.',
        HttpStatus.BAD_REQUEST,
      );
    }
    page = +pageStr;
  }

  if (limitStr === undefined || limitStr === null) {
    limit = DEFAULT_LIMIT;
  } else {
    if (!isIntNumberStringReg(limitStr)) {
      throw new BaseException(
        'Page and limit must be an integer number.',
        HttpStatus.BAD_REQUEST,
      );
    }
    limit = +limitStr;
  }

  if (page < 0 || limit < 0) {
    throw new BaseException(
      'Page and limit must be greater than 0.',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (page == 0 || limit == 0) {
    throw new BaseException(
      'Page and limit must not be less than 1.',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (limit > 200) {
    throw new BaseException(
      'Limit must not be greater than 200.',
      HttpStatus.BAD_REQUEST,
    );
  }

  return {
    page,
    limit,
  };
};

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return createPagination(req.query.page, req.query.limit);
  },
);

export const ApiSortPaginationQuery = () => {
  return applyDecorators(
    ApiPaginationQuery(),
    ApiQuery({
      name: 'order',
      required: false,
      description: 'Order by createdAt field',
      example: ESort.DESC,
      type: String,
    }),
  );
};

const createSortPagination = (
  pageStr: string,
  limitStr: string,
  orderStr: string,
): IPagination => {
  const { page, limit } = createPagination(pageStr, limitStr);
  let order: 1 | -1;

  if (orderStr === undefined || orderStr === null) {
    order = -1;
  } else {
    if (ESort[orderStr] === undefined) {
      throw new BaseException(
        'Order must be DESC or ASC',
        HttpStatus.BAD_REQUEST,
      );
    }
    order = ESort[orderStr] === ESort.DESC ? -1 : 1;
  }

  return {
    page,
    limit,
    sort: {
      createdAt: order,
    },
  };
};

export const SortPagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return createSortPagination(
      req.query.page,
      req.query.limit,
      req.query.order,
    );
  },
);
