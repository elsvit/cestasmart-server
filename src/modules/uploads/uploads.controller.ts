import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadsService } from './uploads.service';

@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFile() file: { buffer: Buffer; size: number; mimetype: string },
    @Query('kind') kind?: string,
  ) {
    return this.uploadsService.uploadImage(file, kind);
  }

  @Get('access-url')
  accessUrl(@Query('path') path: string) {
    return this.uploadsService.getAccessUrl(path ?? '');
  }

  @Delete()
  async remove(@Query('path') path: string) {
    await this.uploadsService.deleteImage(path ?? '');
    return { ok: true };
  }
}
