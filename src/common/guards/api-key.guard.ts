import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.path === '/api/health') {
      return true;
    }

    const expected = this.configService.get<string>('API_KEY')?.trim();

    if (!expected) {
      return true;
    }

    if (request.header('x-api-key') === expected) {
      return true;
    }

    throw new UnauthorizedException('Invalid API key');
  }
}
