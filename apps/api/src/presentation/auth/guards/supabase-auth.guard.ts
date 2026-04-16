import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabasePersistenceService } from '@omninote/persistence';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private readonly persistence = new SupabasePersistenceService();

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
