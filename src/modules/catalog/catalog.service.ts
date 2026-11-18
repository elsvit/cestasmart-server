import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../db/prisma.service';
import { asRows, pickFields, requireId, toJson } from '../../common/utils/rows';
import { CATEGORY_FIELDS, SELLER_PRODUCT_FIELDS } from '../../common/utils/fields';

type RowDelegate = {
  findMany: () => Promise<unknown[]>;
  findUnique: (args: { where: Record<string, unknown> }) => Promise<unknown | null>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  delete: (args: { where: Record<string, unknown> }) => Promise<unknown>;
  upsert: (args: {
    where: Record<string, unknown>;
    create: Record<string, unknown>;
    update: Record<string, unknown>;
  }) => Promise<unknown>;
};

const SELLERS = ['mercadona', 'carrefour'] as const;

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  listCategories(seller: string) {
    return this.categories(seller).findMany().then(rows => rows.map(row => toJson(row)));
  }

  async getCategory(seller: string, id: string) {
    const row = await this.categories(seller).findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Category not found');
    }
    return toJson(row);
  }

  createCategory(seller: string, body: Record<string, unknown>) {
    const id = requireId(body);
    return this.categories(seller)
      .create({
        data: { id, ...pickFields(body, CATEGORY_FIELDS) },
      })
      .then(row => toJson(row));
  }

  updateCategory(seller: string, id: string, body: Record<string, unknown>) {
    return this.categories(seller)
      .update({
        where: { id },
        data: pickFields(body, CATEGORY_FIELDS),
      })
      .then(row => toJson(row))
      .catch(error => this.missing(error, 'Category not found'));
  }

  async deleteCategory(seller: string, id: string) {
    await this.categories(seller)
      .delete({ where: { id } })
      .catch(error => this.missing(error, 'Category not found'));
  }

  bulkUpsertCategories(seller: string, body: unknown) {
    const table = this.categories(seller);
    return this.bulk(asRows(body), row => {
      const id = requireId(row);
      const data = { id, ...pickFields(row, CATEGORY_FIELDS) };
      return table.upsert({ where: { id }, create: data, update: data });
    });
  }

  listProducts(seller: string) {
    return this.products(seller).findMany().then(rows => rows.map(row => toJson(row)));
  }

  async getProduct(seller: string, id: string) {
    const row = await this.products(seller).findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Product not found');
    }
    return toJson(row);
  }

  createProduct(seller: string, body: Record<string, unknown>) {
    const id = requireId(body);
    this.requireName(body);
    return this.products(seller)
      .create({
        data: { id, ...pickFields(body, SELLER_PRODUCT_FIELDS) },
      })
      .then(row => toJson(row));
  }

  updateProduct(seller: string, id: string, body: Record<string, unknown>) {
    return this.products(seller)
      .update({
        where: { id },
        data: pickFields(body, SELLER_PRODUCT_FIELDS),
      })
      .then(row => toJson(row))
      .catch(error => this.missing(error, 'Product not found'));
  }

  async deleteProduct(seller: string, id: string) {
    await this.products(seller)
      .delete({ where: { id } })
      .catch(error => this.missing(error, 'Product not found'));
  }

  bulkUpsertProducts(seller: string, body: unknown) {
    const table = this.products(seller);
    return this.bulk(asRows(body), row => {
      const id = requireId(row);
      this.requireName(row);
      const data = { id, ...pickFields(row, SELLER_PRODUCT_FIELDS) };
      return table.upsert({ where: { id }, create: data, update: data });
    });
  }

  listLinks(seller: string) {
    return this.links(seller).findMany().then(rows => rows.map(row => toJson(row)));
  }

  createLink(seller: string, body: Record<string, unknown>) {
    const { data } = this.linkKey(body);
    return this.links(seller)
      .create({ data })
      .then(row => toJson(row));
  }

  bulkUpsertLinks(seller: string, body: unknown) {
    const table = this.links(seller);
    return this.bulk(asRows(body), row => {
      const { where, data } = this.linkKey(row);
      return table.upsert({ where, create: data, update: {} });
    });
  }

  async deleteLink(seller: string, categoryId: string, productId: string) {
    await this.links(seller)
      .delete({
        where: { category_id_product_id: { category_id: categoryId, product_id: productId } },
      })
      .catch(error => this.missing(error, 'Category product not found'));
  }

  private categories(seller: string): RowDelegate {
    this.assertSeller(seller);
    const table =
      seller === 'mercadona'
        ? this.prisma.mercadonaCategory
        : this.prisma.carrefourCategory;
    return table as unknown as RowDelegate;
  }

  private products(seller: string): RowDelegate {
    this.assertSeller(seller);
    const table =
      seller === 'mercadona'
        ? this.prisma.mercadonaProduct
        : this.prisma.carrefourProduct;
    return table as unknown as RowDelegate;
  }

  private links(seller: string): RowDelegate {
    this.assertSeller(seller);
    const table =
      seller === 'mercadona'
        ? this.prisma.mercadonaCategoryProduct
        : this.prisma.carrefourCategoryProduct;
    return table as unknown as RowDelegate;
  }

  private assertSeller(seller: string): asserts seller is (typeof SELLERS)[number] {
    if (!SELLERS.includes(seller as (typeof SELLERS)[number])) {
      throw new NotFoundException('Seller must be mercadona or carrefour');
    }
  }

  private requireName(body: Record<string, unknown>) {
    if (typeof body.name !== 'string' || body.name.trim() === '') {
      throw new BadRequestException('name is required');
    }
  }

  private linkKey(body: Record<string, unknown>) {
    const categoryId = body.category_id;
    const productId = body.product_id;

    if (typeof categoryId !== 'string' || typeof productId !== 'string') {
      throw new BadRequestException('category_id and product_id are required');
    }

    const data = {
      category_id: categoryId,
      product_id: productId,
    };

    return {
      where: { category_id_product_id: data },
      data,
    };
  }

  private async bulk(
    rows: Record<string, unknown>[],
    toQuery: (row: Record<string, unknown>) => Promise<unknown>,
  ) {
    const saved: unknown[] = [];

    for (let index = 0; index < rows.length; index += 50) {
      const chunk = rows.slice(index, index + 50);
      const queries = chunk.map(row => toQuery(row));
      const result = await this.prisma.$transaction(queries as never);
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
