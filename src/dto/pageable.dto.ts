export class PageableDto {
  page: number;
  size: number;
  sort?: string; // "name,asc" ou "name,desc"

  constructor(page = 1, size = 10, sort?: string) {
    this.page = page;
    this.size = size;
    this.sort = sort;
  }

  static fromQuery(query: any): PageableDto {
    return new PageableDto(
      Number(query.page || 1),
      Number(query.size || 10),
      query.sort,
    );
  }
}
