import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from, mergeMap, Observable } from 'rxjs';

import { UploadsService } from './uploads.service';

const MEDIA_FIELDS = new Set(['image', 'thumbnail', 'image_url', 'url']);

@Injectable()
export class MediaUrlInterceptor implements NestInterceptor {
  constructor(private readonly uploadsService: UploadsService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(mergeMap(body => from(this.rewrite(body))));
  }

  private async rewrite(value: unknown, key?: string): Promise<unknown> {
    if (typeof value === 'string' && key && MEDIA_FIELDS.has(key)) {
      return this.uploadsService.resolveStoredMedia(value);
    }

    if (Array.isArray(value)) {
      if (key === 'images') {
        return Promise.all(
          value.map(item =>
            typeof item === 'string'
              ? this.uploadsService.resolveStoredMedia(item)
              : this.rewrite(item),
          ),
        );
      }

      return Promise.all(value.map(item => this.rewrite(item)));
    }

    if (value && typeof value === 'object') {
      const output: Record<string, unknown> = {};

      for (const [childKey, childValue] of Object.entries(value)) {
        output[childKey] = await this.rewrite(childValue, childKey);
      }

      return output;
    }

    return value;
  }
}
