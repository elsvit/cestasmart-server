import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../db/prisma.service';
import { PRICE_FIELDS } from '../../common/utils/fields';
import { pickFields, toJson } from '../../common/utils/rows';

@Injectable()
export class PricesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(seller?: string) {
    const rows = await this.prisma.price.findMany({
      where: seller ? { seller } : undefined,
      orderBy: { date: 'desc' },
    });

    return rows.map(row => this.present(row));
  }

  async get(seller: string, date: string) {
    const row = await this.prisma.price.findUnique({
      where: { date_seller: { date: this.parseDate(date), seller } },
    });

    if (!row) {
      throw new NotFoundException('Price not found');
    }

    return this.present(row);
  }

  upsert(body: Record<string, unknown>) {
    const key = this.key(body);
    const data = { ...key, ...pickFields(body, PRICE_FIELDS) };

    return this.prisma.price
      .upsert({
        where: { date_seller: key },
        create: data,
        update: pickFields(body, PRICE_FIELDS) as never,
      })
      .then(row => this.present(row));
  }

  async remove(seller: string, date: string) {
    await this.prisma.price
      .delete({
        where: { date_seller: { date: this.parseDate(date), seller } },
      })
      .catch(error => {
        if (
          typeof error === 'object' &&
          error !== null &&
          'code' in error &&
          error.code === 'P2025'
        ) {
          throw new NotFoundException('Price not found');
        }

        throw error;
      });
  }

  private key(body: Record<string, unknown>) {
    if (typeof body.seller !== 'string' || body.seller.trim() === '') {
      throw new BadRequestException('seller is required');
    }

    if (typeof body.date !== 'string') {
      throw new BadRequestException('date is required');
    }

    return {
      date: this.parseDate(body.date),
      seller: body.seller,
    };
  }

  private parseDate(value: string) {
    const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('date is not a valid date');
    }

    return date;
  }

  private present(row: { date: Date }) {
    return toJson(row, ['date']);
  }
}
