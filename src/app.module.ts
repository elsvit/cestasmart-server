import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ApiKeyGuard } from './common/guards/api-key.guard';
import { HttpExceptionFilter } from './common/errors/http-exception.filter';
import { PrismaModule } from './db/prisma.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EmailModule } from './modules/email/email.module';
import { DishesModule } from './modules/dishes/dishes.module';
import { GenericProductsModule } from './modules/generic-products/generic-products.module';
import { HealthController } from './modules/health/health.controller';
import { PricesModule } from './modules/prices/prices.module';
import { MediaUrlInterceptor } from './modules/uploads/media-url.interceptor';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EmailModule,
    UploadsModule,
    CatalogModule,
    GenericProductsModule,
    DishesModule,
    PricesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MediaUrlInterceptor,
    },
  ],
})
export class AppModule {}
