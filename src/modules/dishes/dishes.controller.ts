import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { DishesService } from './dishes.service';

@Controller('api')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get('dishes')
  list(@Query('q') query?: string) {
    return this.dishesService.list(query);
  }

  @Get('dishes/:id')
  get(@Param('id') id: string) {
    return this.dishesService.get(id);
  }

  @Post('dishes')
  create(@Body() body: Record<string, unknown>) {
    return this.dishesService.create(body);
  }

  @Put('dishes')
  bulk(@Body() body: unknown) {
    return this.dishesService.bulkUpsert(body);
  }

  @Patch('dishes/:id')
  update(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.dishesService.update(id, body);
  }

  @Delete('dishes/:id/products')
  async clearProducts(@Param('id') id: string) {
    await this.dishesService.deleteProductsForDish(id);
    return { ok: true };
  }

  @Delete('dishes/:id')
  async remove(@Param('id') id: string) {
    await this.dishesService.remove(id);
    return { ok: true };
  }

  @Get('dishes/:id/products')
  listForDish(@Param('id') id: string) {
    return this.dishesService.listProductsForDish(id);
  }

  @Get('dish-products')
  listProducts() {
    return this.dishesService.listProducts();
  }

  @Put('dish-products')
  bulkProducts(@Body() body: unknown) {
    return this.dishesService.bulkUpsertProducts(body);
  }

  @Post('dish-products')
  upsertProduct(@Body() body: Record<string, unknown>) {
    return this.dishesService.upsertProduct(body);
  }

  @Delete('dish-products')
  async deleteProduct(
    @Query('dishId') dishId: string,
    @Query('productId') productId: string,
    @Query('seller') seller: string,
  ) {
    await this.dishesService.deleteProduct(dishId, productId, seller);
    return { ok: true };
  }
}
