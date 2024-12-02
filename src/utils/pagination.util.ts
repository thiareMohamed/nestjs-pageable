import { PageableDto } from '../dto/pageable.dto';

export function paginate<T>(
  data: T[],
  pageable: PageableDto,
): { paginatedData: T[]; totalElements: number } {
  const start = (pageable.page - 1) * pageable.size;
  const end = start + pageable.size;
  return {
    paginatedData: data.slice(start, end),
    totalElements: data.length,
  };
}
