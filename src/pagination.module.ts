import { Module } from '@nestjs/common';
import { TypeORMStrategy } from './strategies/typeorm.strategy';
import { MongooseStrategy } from './strategies/mongoose.strategy';
import { PaginationFacade } from './services/pagination.facade';

@Module({
  providers: [TypeORMStrategy, MongooseStrategy, PaginationFacade],
  exports: [PaginationFacade],
})
export class PaginationModule {}
