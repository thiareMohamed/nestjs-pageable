export class Page<T> {
  constructor(
    public readonly data: T[],
    public readonly totalElements: number,
    public readonly currentPage: number,
    public readonly size: number,
  ) {}

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.size);
  }
}
