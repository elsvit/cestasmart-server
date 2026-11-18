import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../db/prisma.service';
import { DISH_FIELDS, DISH_PRODUCT_FIELDS } from '../../common/utils/fields';
import { asRows, pickFields, requireId, toJson } from '../../common/utils/rows';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class DishesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadsService: UploadsService,
  ) {}

  async list(query?: string) {
    const rows = await this.prisma.dish.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { name_en: { contains: query, mode: 'insensitive' } },
              { description_en: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { order_index: 'asc' },
    });

    return rows.map(row => toJson(row));
  }

  async get(id: string) {
    const row = await this.prisma.dish.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Dish not found');
    }
    return toJson(row);
  }

  create(body: Record<string, unknown>) {
    const id = requireId(body);
    this.requireName(body);
    return this.prisma.dish
      .create({ data: { id, ...pickFields(body, DISH_FIELDS) } as never })
      .then(row => toJson(row));
  }

  update(id: string, body: Record<string, unknown>) {
    return this.prisma.dish
      .update({ where: { id }, data: pickFields(body, DISH_FIELDS) })
      .then(row => toJson(row))
      .catch(error => this.missing(error, 'Dish not found'));
  }

  async remove(id: string) {
    const row = await this.prisma.dish.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException('Dish not found');
    }

    await this.uploadsService.deleteIfOwned(row.image);
    await this.uploadsService.deleteIfOwned(row.thumbnail);
    await this.prisma.dish.delete({ where: { id } });
  }

  bulkUpsert(body: unknown) {
    return this.bulk(asRows(body), row => {
      const id = requireId(row);
      this.requireName(row);
      const data = { id, ...pickFields(row, DISH_FIELDS) } as never;
      return this.prisma.dish.upsert({
        where: { id },
        create: data,
        update: data,
      });
    });
  }

  listProducts() {
    return this.prisma.dishProduct.findMany().then(rows => rows.map(row => toJson(row)));
  }

  listProductsForDish(dishId: string) {
    return this.prisma.dishProduct
      .findMany({ where: { dish_id: dishId } })
      .then(rows => rows.map(row => toJson(row)));
  }

  upsertProduct(body: Record<string, unknown>) {
    const key = this.productKey(body);
    const fields = pickFields(body, DISH_PRODUCT_FIELDS);
    const data = { ...key, ...fields };
    return this.prisma.dishProduct
      .upsert({
        where: { dish_id_product_id_seller: key },
        create: data,
        update: fields,
      })
      .then(row => toJson(row));
  }

  bulkUpsertProducts(body: unknown) {
    return this.bulk(asRows(body), row => {
      const key = this.productKey(row);
      const fields = pickFields(row, DISH_PRODUCT_FIELDS);
      const data = { ...key, ...fields };
      return this.prisma.dishProduct.upsert({
        where: { dish_id_product_id_seller: key },
        create: data,
        update: fields,
      });
    });
  }

  async deleteProductsForDish(dishId: string) {
    await this.prisma.dishProduct.deleteMany({ where: { dish_id: dishId } });
  }

  async deleteProduct(dishId: string, productId: string, seller: string) {
    await this.prisma.dishProduct
      .delete({
        where: {
          dish_id_product_id_seller: {
            dish_id: dishId,
            product_id: productId,
            seller,
          },
        },
      })
      .catch(error => this.missing(error, 'Dish product not found'));
  }

  private productKey(body: Record<string, unknown>) {
    const dishId = body.dish_id;
    const productId = body.product_id;
    const seller = body.seller;

    if (
      typeof dishId !== 'string' ||
      typeof productId !== 'string' ||
      typeof seller !== 'string'
    ) {
      throw new BadRequestException('dish_id, product_id, and seller are required');
    }

    return {
      dish_id: dishId,
      product_id: productId,
      seller,
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
