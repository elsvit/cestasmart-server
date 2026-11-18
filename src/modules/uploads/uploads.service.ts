import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ObjectStorageService } from './object-storage.service';
import {
  assertStorageKey,
  buildObjectKey,
  extensionForContentType,
  isImageKind,
} from './media-path.utils';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

@Injectable()
export class UploadsService {
  constructor(private readonly objectStorage: ObjectStorageService) {}

  async uploadImage(
    file: { buffer: Buffer; size: number; mimetype: string } | undefined,
    kindValue: string | undefined,
  ): Promise<{ path: string; url: string }> {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    if (file.size > MAX_IMAGE_BYTES) {
      throw new BadRequestException('Image must be 5 MB or smaller');
    }

    const kind = kindValue ?? 'dish-images';

    if (!isImageKind(kind)) {
      throw new BadRequestException(
        'kind must be dish-images or generic-product-images',
      );
    }

    const extension = extensionForContentType(file.mimetype);

    if (!extension) {
      throw new BadRequestException('Only jpeg, png, webp, and gif images are allowed');
    }

    const key = buildObjectKey(kind, extension);

    if (this.objectStorage.isEnabled()) {
      await this.objectStorage.putObject(key, file.buffer, file.mimetype);
      const url = await this.objectStorage.createPresignedReadUrl(key);

      return { path: key, url };
    }

    const absolutePath = join(process.cwd(), 'uploads', key);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.buffer);

    return {
      path: key,
      url: `/uploads/${key}`,
    };
  }

  async getAccessUrl(path: string): Promise<{ url: string; expiresIn: number | null }> {
    const key = this.readKey(path);

    if (this.objectStorage.isEnabled()) {
      return {
        url: await this.objectStorage.createPresignedReadUrl(key),
        expiresIn: this.objectStorage.getPresignExpirySeconds(),
      };
    }

    return {
      url: `/uploads/${key}`,
      expiresIn: null,
    };
  }

  async deleteImage(path: string): Promise<void> {
    const key = this.readKey(path);

    if (this.objectStorage.isEnabled()) {
      await this.objectStorage.deleteObject(key);
      return;
    }

    try {
      await unlink(join(process.cwd(), 'uploads', key));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new NotFoundException('Image not found');
      }

      throw error;
    }
  }

  async deleteIfOwned(path: string | null | undefined): Promise<void> {
    if (!path || !path.includes('cestasmart/')) {
      return;
    }

    const key = path.includes('cestasmart/')
      ? path.slice(path.indexOf('cestasmart/'))
      : path;

    try {
      await this.deleteImage(key);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        console.warn('Failed to delete image', key, error);
      }
    }
  }

  private readKey(path: string): string {
    try {
      return assertStorageKey(path);
    } catch {
      throw new BadRequestException('path must start with cestasmart/');
    }
  }
}
