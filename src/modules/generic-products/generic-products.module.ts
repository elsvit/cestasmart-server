import { Module } from '@nestjs/common';

import { UploadsModule } from '../uploads/uploads.module';
import { GenericProductsController } from './generic-products.controller';
import { GenericProductsService } from './generic-products.service';

@Module({
  imports: [UploadsModule],
  controllers: [GenericProductsController],
  providers: [GenericProductsService],
})
export class GenericProductsModule {}
