import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PageableDto } from '../dto/pageable.dto';

export const Pageable = createParamDecorator(
  (_, ctx: ExecutionContext): PageableDto => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, size = 10, sort } = request.query;
    return { page: Number(page), size: Number(size), sort };
  },
);
