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

import { CatalogService } from './catalog.service';

@Controller('api/sellers/:seller')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('categories')
  listCategories(@Param('seller') seller: string) {
    return this.catalogService.listCategories(seller);
  }

  @Get('categories/:id')
  getCategory(@Param('seller') seller: string, @Param('id') id: string) {
    return this.catalogService.getCategory(seller, id);
  }

  @Post('categories')
  createCategory(
    @Param('seller') seller: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.catalogService.createCategory(seller, body);
  }

  @Put('categories')
  bulkCategories(@Param('seller') seller: string, @Body() body: unknown) {
    return this.catalogService.bulkUpsertCategories(seller, body);
  }

  @Patch('categories/:id')
  updateCategory(
    @Param('seller') seller: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.catalogService.updateCategory(seller, id, body);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('seller') seller: string, @Param('id') id: string) {
    await this.catalogService.deleteCategory(seller, id);
    return { ok: true };
  }

  @Get('products')
  listProducts(@Param('seller') seller: string) {
    return this.catalogService.listProducts(seller);
  }

  @Get('products/:id')
  getProduct(@Param('seller') seller: string, @Param('id') id: string) {
    return this.catalogService.getProduct(seller, id);
  }

  @Post('products')
  createProduct(
    @Param('seller') seller: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.catalogService.createProduct(seller, body);
  }

  @Put('products')
  bulkProducts(@Param('seller') seller: string, @Body() body: unknown) {
    return this.catalogService.bulkUpsertProducts(seller, body);
  }

  @Patch('products/:id')
  updateProduct(
    @Param('seller') seller: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.catalogService.updateProduct(seller, id, body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('seller') seller: string, @Param('id') id: string) {
    await this.catalogService.deleteProduct(seller, id);
    return { ok: true };
  }

  @Get('category-products')
  listLinks(@Param('seller') seller: string) {
    return this.catalogService.listLinks(seller);
  }

  @Post('category-products')
  createLink(
    @Param('seller') seller: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.catalogService.createLink(seller, body);
  }

  @Put('category-products')
  bulkLinks(@Param('seller') seller: string, @Body() body: unknown) {
    return this.catalogService.bulkUpsertLinks(seller, body);
  }

  @Delete('category-products/:categoryId/:productId')
  async deleteLink(
    @Param('seller') seller: string,
    @Param('categoryId') categoryId: string,
    @Param('productId') productId: string,
  ) {
    await this.catalogService.deleteLink(seller, categoryId, productId);
    return { ok: true };
  }
}
