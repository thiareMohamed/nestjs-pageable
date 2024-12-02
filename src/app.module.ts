import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaginationModule } from './pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
