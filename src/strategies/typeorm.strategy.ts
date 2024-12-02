import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationStrategy } from '../interfaces/pagination.interface';
import { Page } from '../dto/page.dto';
import { PageableDto } from '../dto/pageable.dto';

@Injectable()
export class TypeORMStrategy<T> implements PaginationStrategy<T> {
  async paginate(
    repository: Repository<T>,
    pageable: PageableDto,
    options?: {
      alias?: string;
      customQuery?: (qb: SelectQueryBuilder<T>) => void;
    },
  ): Promise<Page<T>> {
    const { page, size, sort } = pageable;
    const alias = options?.alias ?? 'entity';
    const queryBuilder = repository.createQueryBuilder(alias);

    if (sort) {
      const [field, order] = sort.split(',');
      queryBuilder.orderBy(
        `${alias}.${field}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    if (options?.customQuery) {
      options.customQuery(queryBuilder);
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
    return new Page(data, total, page, size);
  }
}
