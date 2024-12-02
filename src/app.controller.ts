import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { PageablePipe } from './pipes/pageable.pipe';
import { Page } from './dto/page.dto';
import { PageableDto } from './dto/pageable.dto';
import { paginate } from './utils/pagination.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly items = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
  }));

  @Get()
  @UsePipes(PageablePipe)
  findAll(@Query() pageable: PageableDto): Page<any> {
    const { paginatedData, totalElements } = paginate(this.items, pageable);
    return new Page(paginatedData, totalElements, pageable.page, pageable.size);
  }
}
