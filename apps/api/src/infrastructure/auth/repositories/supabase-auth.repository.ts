import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { SupabasePersistenceService } from '@omninote/persistence';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';
import { User } from '../../../domain/auth/entities/user.entity';

/**
 * Infrastructure implementation of AuthRepository using Supabase.
 */
@Injectable()
export class SupabaseAuthRepository extends AuthRepository {
  private readonly persistence: SupabasePersistenceService;

  constructor() {
    super();
    this.persistence = new SupabasePersistenceService();
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const { data, error } = await this.persistence.signIn(email, password);

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    const user = new User(data.user.id, data.user.email!);
    const token = data.session.access_token;

    return { user, token };
  }

  async register(name: string, email: string, password: string): Promise<{ user: User }> {
    const { data, error } = await this.persistence.signUp(email, password, name);

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'Registration failed');
    }

    const user = new User(data.user.id, data.user.email!);
    return { user };
  }
}
