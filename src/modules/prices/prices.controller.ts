import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';

import { PricesService } from './prices.service';

@Controller('api/prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  list(@Query('seller') seller?: string) {
    return this.pricesService.list(seller);
  }

  @Get(':seller/:date')
  get(@Param('seller') seller: string, @Param('date') date: string) {
    return this.pricesService.get(seller, date);
  }

  @Put()
  upsert(@Body() body: Record<string, unknown>) {
    return this.pricesService.upsert(body);
  }

  @Delete(':seller/:date')
  async remove(@Param('seller') seller: string, @Param('date') date: string) {
    await this.pricesService.remove(seller, date);
    return { ok: true };
  }
}
