import { Injectable } from '@nestjs/common';
import { TypeORMStrategy } from '../strategies/typeorm.strategy';
import { MongooseStrategy } from '../strategies/mongoose.strategy';
import { Page } from '../dto/page.dto';
import { PageableDto } from '../dto/pageable.dto';

@Injectable()
export class PaginationFacade {
  constructor(
    private readonly typeORMStrategy: TypeORMStrategy<any>,
    private readonly mongooseStrategy: MongooseStrategy<any>,
  ) {}

  async paginate<T>(
    dataSource: any,
    pageable: PageableDto,
    options?: any,
  ): Promise<Page<T>> {
    if ('getRepository' in dataSource) {
      return this.typeORMStrategy.paginate(dataSource, pageable, options);
    } else if ('modelName' in dataSource) {
      return this.mongooseStrategy.paginate(dataSource, pageable, options);
    }
    throw new Error('Unsupported data source type');
  }
}
