import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

import { GenericProductsService } from './generic-products.service';

@Controller('api/generic')
export class GenericProductsController {
  constructor(private readonly genericProductsService: GenericProductsService) {}

  @Get('categories')
  listCategories() {
    return this.genericProductsService.listCategories();
  }

  @Get('categories/:id')
  getCategory(@Param('id') id: string) {
    return this.genericProductsService.getCategory(id);
  }

  @Post('categories')
  createCategory(@Body() body: Record<string, unknown>) {
    return this.genericProductsService.createCategory(body);
  }

  @Put('categories')
  bulkCategories(@Body() body: unknown) {
    return this.genericProductsService.bulkUpsertCategories(body);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.genericProductsService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.genericProductsService.deleteCategory(id);
    return { ok: true };
  }

  @Get('products')
  listProducts() {
    return this.genericProductsService.listProducts();
  }

  @Get('products/:id')
  getProduct(@Param('id') id: string) {
    return this.genericProductsService.getProduct(id);
  }

  @Post('products')
  createProduct(@Body() body: Record<string, unknown>) {
    return this.genericProductsService.createProduct(body);
  }

  @Put('products')
  bulkProducts(@Body() body: unknown) {
    return this.genericProductsService.bulkUpsertProducts(body);
  }

  @Patch('products/:id')
  updateProduct(@Param('id') id: string, @Body() body: Record<string, unknown>) {
    return this.genericProductsService.updateProduct(id, body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.genericProductsService.deleteProduct(id);
    return { ok: true };
  }

  @Get('product-matching')
  listMatching() {
    return this.genericProductsService.listMatching();
  }

  @Post('product-matching')
  createMatching(@Body() body: Record<string, unknown>) {
    return this.genericProductsService.createMatching(body);
  }

  @Put('product-matching')
  bulkMatching(@Body() body: unknown) {
    return this.genericProductsService.bulkUpsertMatching(body);
  }

  @Delete('product-matching/:id')
  async deleteMatching(@Param('id') id: string) {
    await this.genericProductsService.deleteMatching(id);
    return { ok: true };
  }

  @Get('category-products')
  listLinks() {
    return this.genericProductsService.listLinks();
  }

  @Post('category-products')
  createLink(@Body() body: Record<string, unknown>) {
    return this.genericProductsService.createLink(body);
  }

  @Put('category-products')
  bulkLinks(@Body() body: unknown) {
    return this.genericProductsService.bulkUpsertLinks(body);
  }

  @Delete('category-products/:categoryId/:productId')
  async deleteLink(
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    await this.genericProductsService.deleteLink(categoryId, productId);
    return { ok: true };
  }
}
