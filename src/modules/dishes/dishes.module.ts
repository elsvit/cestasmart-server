import { Module } from '@nestjs/common';

import { UploadsModule } from '../uploads/uploads.module';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';

@Module({
  imports: [UploadsModule],
  controllers: [DishesController],
  providers: [DishesService],
})
export class DishesModule {}
