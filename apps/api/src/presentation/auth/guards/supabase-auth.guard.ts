import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { SupabasePersistenceService } from '../../../infrastructure/persistence/supabase-persistence.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    @Inject(SupabasePersistenceService) private readonly persistence: SupabasePersistenceService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    const userPayload = await this.persistence.verifyToken(token);

    if (!userPayload) {
      throw new UnauthorizedException('Token is invalid or expired');
    }

    request.user = userPayload;

    return true;
  }
}
