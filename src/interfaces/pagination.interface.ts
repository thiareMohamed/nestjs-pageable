import { Page } from '../dto/page.dto';
import { PageableDto } from '../dto/pageable.dto';

export interface PaginationStrategy<T> {
  paginate(
    dataSource: any,
    pageable: PageableDto,
    options?: any,
  ): Promise<Page<T>>;
}
