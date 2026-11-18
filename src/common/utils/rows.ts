import { BadRequestException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

const TIMESTAMP_FIELDS = new Set(['created_at', 'updated_at']);

export function requireId(body: Record<string, unknown>): string {
  const id = body.id;

  if (typeof id !== 'string' || id.trim() === '') {
    throw new BadRequestException('id is required');
  }

  return id;
}

export function pickFields(
  body: Record<string, unknown>,
  fields: readonly string[],
): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    if (body[field] !== undefined) {
      data[field] = coerce(field, body[field]);
    }
  }

  return data;
}

export function asRows(body: unknown): Record<string, unknown>[] {
  if (!Array.isArray(body)) {
    throw new BadRequestException('Expected a JSON array');
  }

  return body.map(row => {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) {
      throw new BadRequestException('Each item must be an object');
    }

    return row as Record<string, unknown>;
  });
}

function coerce(field: string, value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  if (TIMESTAMP_FIELDS.has(field) || field === 'date') {
    const date = new Date(field === 'date' ? `${value.slice(0, 10)}T00:00:00.000Z` : value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException(`${field} is not a valid date`);
    }

    return date;
  }

  return value;
}

export function toJson(
  value: unknown,
  dateOnlyFields: readonly string[] = [],
): unknown {
  if (value instanceof Prisma.Decimal) {
    return value.toNumber();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(item => toJson(item, dateOnlyFields));
  }

  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(value)) {
      if (dateOnlyFields.includes(key) && nested instanceof Date) {
        output[key] = nested.toISOString().slice(0, 10);
        continue;
      }

      output[key] = toJson(nested, dateOnlyFields);
    }

    return output;
  }

  return value;
}
