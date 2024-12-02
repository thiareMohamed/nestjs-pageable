import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginationStrategy } from '../interfaces/pagination.interface';
import { Page } from '../dto/page.dto';
import { PageableDto } from '../dto/pageable.dto';

@Injectable()
export class MongooseStrategy<T> implements PaginationStrategy<T> {
  async paginate(
    model: Model<T>,
    pageable: PageableDto,
    options?: { filter?: Record<string, any>; projection?: any },
  ): Promise<Page<T>> {
    const { page, size, sort } = pageable;
    const filter = options?.filter ?? {};
    const projection = options?.projection ?? null;

    const query = model.find(filter, projection);

    if (sort) {
      const [field, order] = sort.split(',');
      query.sort({ [field]: order === 'asc' ? 1 : -1 });
    }

    const data = await query
      .skip((page - 1) * size)
      .limit(size)
      .exec();
    const total = await model.countDocuments(filter).exec();

    return new Page(data, total, page, size);
  }
}
