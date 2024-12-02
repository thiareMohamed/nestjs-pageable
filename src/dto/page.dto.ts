export class Page<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;

  constructor(data: T[], totalElements: number, page: number, size: number) {
    this.data = data;
    this.totalElements = totalElements;
    this.totalPages = Math.ceil(totalElements / size);
    this.currentPage = page;
  }
}
