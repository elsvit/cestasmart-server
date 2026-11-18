import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../db/prisma.service';
import {
  CATEGORY_FIELDS,
  GENERIC_PRODUCT_FIELDS,
  MATCHING_FIELDS,
} from '../../common/utils/fields';
import { asRows, pickFields, requireId, toJson } from '../../common/utils/rows';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class GenericProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  listCategories() {
    return this.prisma.genericCategory.findMany().then(rows => rows.map(row => toJson(row)));
  }

  async getCategory(id: string) {
    const row = await this.prisma.genericCategory.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Category not found');
    }
    return toJson(row);
  }

  createCategory(body: Record<string, unknown>) {
    const id = requireId(body);
    this.requireName(body);
    return this.prisma.genericCategory
      .create({ data: { id, ...pickFields(body, CATEGORY_FIELDS) } as never })
      .then(row => toJson(row));
  }

  updateCategory(id: string, body: Record<string, unknown>) {
    return this.prisma.genericCategory
      .update({ where: { id }, data: pickFields(body, CATEGORY_FIELDS) })
      .then(row => toJson(row))
      .catch(error => this.missing(error, 'Category not found'));
  }

  async deleteCategory(id: string) {
    await this.prisma.genericCategory
      .delete({ where: { id } })
      .catch(error => this.missing(error, 'Category not found'));
  }

  bulkUpsertCategories(body: unknown) {
    return this.bulk(asRows(body), row => {
      const id = requireId(row);
      const data = { id, ...pickFields(row, CATEGORY_FIELDS) } as never;
      return this.prisma.genericCategory.upsert({
        where: { id },
        create: data,
        update: data,
      });
    });
  }

  listProducts() {
    return this.prisma.genericProduct.findMany().then(rows => rows.map(row => toJson(row)));
  }

  async getProduct(id: string) {
    const row = await this.prisma.genericProduct.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Product not found');
    }
    return toJson(row);
  }

  createProduct(body: Record<string, unknown>) {
    const id = requireId(body);
    this.requireName(body);
    return this.prisma.genericProduct
      .create({ data: { id, ...pickFields(body, GENERIC_PRODUCT_FIELDS) } as never })
      .then(row => toJson(row));
  }

  updateProduct(id: string, body: Record<string, unknown>) {
    return this.prisma.genericProduct
      .update({ where: { id }, data: pickFields(body, GENERIC_PRODUCT_FIELDS) })
      .then(row => toJson(row))
      .catch(error => this.missing(error, 'Product not found'));
  }

  async deleteProduct(id: string) {
    const row = await this.prisma.genericProduct.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Product not found');
    }

    await this.uploadsService.deleteIfOwned(row.image);
    await this.uploadsService.deleteIfOwned(row.thumbnail);
    await this.prisma.genericProduct.delete({ where: { id } });
  }

  bulkUpsertProducts(body: unknown) {
    return this.bulk(asRows(body), row => {
      const id = requireId(row);
      this.requireName(row);
      const data = { id, ...pickFields(row, GENERIC_PRODUCT_FIELDS) } as never;
      return this.prisma.genericProduct.upsert({
        where: { id },
        create: data,
        update: data,
      });
    });
  }

  listMatching() {
    return this.prisma.genericProductMatching
      .findMany()
      .then(rows => rows.map(row => toJson(row)));
  }

  createMatching(body: Record<string, unknown>) {
    const data = this.matchingData(body);
    return this.prisma.genericProductMatching
      .create({ data })
      .then(row => toJson(row));
  }

  bulkUpsertMatching(body: unknown) {
    return this.bulk(asRows(body), row => {
      const data = this.matchingData(row);
      return this.prisma.genericProductMatching.upsert({
        where: {
          generic_product_id_seller_seller_product_id: {
            generic_product_id: data.generic_product_id,
            seller: data.seller,
            seller_product_id: data.seller_product_id,
          },
        },
        create: data,
        update: data,
      });
    });
  }

  async deleteMatching(id: string) {
    await this.prisma.genericProductMatching
      .delete({ where: { id } })
      .catch(error => this.missing(error, 'Matching product not found'));
  }

  listLinks() {
    return this.prisma.genericCategoryProduct
      .findMany()
      .then(rows => rows.map(row => toJson(row)));
  }

  createLink(body: Record<string, unknown>) {
    const data = this.linkData(body);
    return this.prisma.genericCategoryProduct
      .create({ data })
      .then(row => toJson(row));
  }

  bulkUpsertLinks(body: unknown) {
    return this.bulk(asRows(body), row => {
      const data = this.linkData(row);
      return this.prisma.genericCategoryProduct.upsert({
        where: { category_id_product_id: data },
        create: data,
        update: {},
      });
    });
  }

  async deleteLink(categoryId: string, productId: string) {
    await this.prisma.genericCategoryProduct
      .delete({
        where: {
          category_id_product_id: {
            category_id: categoryId,
            product_id: productId,
          },
        },
      })
      .catch(error => this.missing(error, 'Category product not found'));
  }

  private matchingData(body: Record<string, unknown>) {
    const data = pickFields(body, MATCHING_FIELDS);
    const genericProductId = data.generic_product_id;
    const seller = data.seller;
    const sellerProductId = data.seller_product_id;

    if (
      typeof genericProductId !== 'string' ||
      typeof seller !== 'string' ||
      typeof sellerProductId !== 'string'
    ) {
      throw new BadRequestException(
        'generic_product_id, seller, and seller_product_id are required',
      );
    }

    if (typeof body.id === 'string' && body.id.trim() !== '') {
      data.id = body.id;
    }

    return data as {
      id?: string;
      generic_product_id: string;
      seller: string;
      seller_product_id: string;
    };
  }

  private linkData(body: Record<string, unknown>) {
    const categoryId = body.category_id;
    const productId = body.product_id;

    if (typeof categoryId !== 'string' || typeof productId !== 'string') {
      throw new BadRequestException('category_id and product_id are required');
    }

    return {
      category_id: categoryId,
      product_id: productId,
    };
  }

  private requireName(body: Record<string, unknown>) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      throw new BadRequestException('name is required');
    }
  }

  private async bulk<T>(
    rows: Record<string, unknown>[],
    toQuery: (row: Record<string, unknown>) => Promise<T>,
  ) {
    const saved: T[] = [];

    for (let index = 0; index < rows.length; index += 50) {
      const chunk = rows.slice(index, index + 50);
      const result = await this.prisma.$transaction(
        chunk.map(row => toQuery(row)) as never,
      );
      saved.push(...result);
    }

    return saved.map(row => toJson(row));
  }

  private missing(error: unknown, message: string): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(message);
    }

    throw error;
  }
}
