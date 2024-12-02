import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { PageableDto } from '../dto/pageable.dto';

@Injectable()
export class PageablePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): PageableDto {
    return PageableDto.fromQuery(value);
  }
}
