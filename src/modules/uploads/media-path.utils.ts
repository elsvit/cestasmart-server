import { randomUUID } from 'node:crypto';

export const STORAGE_PREFIX = 'cestasmart/';

export const IMAGE_KINDS = ['dish-images', 'generic-product-images'] as const;

export type ImageKind = (typeof IMAGE_KINDS)[number];

const IMAGE_MIME_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

export function isImageKind(value: string): value is ImageKind {
  return (IMAGE_KINDS as readonly string[]).includes(value);
}

export function extensionForContentType(contentType: string): string | undefined {
  return IMAGE_MIME_EXTENSION[contentType];
}

export function buildObjectKey(kind: ImageKind, extension: string): string {
  return `${STORAGE_PREFIX}${kind}/${randomUUID()}${extension}`;
}

export function assertStorageKey(path: string): string {
  const key = path.replace(/^\/+/, '');

  if (!key.startsWith(STORAGE_PREFIX) || key.includes('..')) {
    throw new Error('Invalid storage path');
  }

  return key;
}
