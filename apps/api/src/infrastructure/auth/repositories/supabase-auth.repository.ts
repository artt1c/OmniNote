import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { SupabasePersistenceService } from '../../persistence/supabase-persistence.service';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';
import { User } from '../../../domain/auth/entities/user.entity';

/**
 * Infrastructure implementation of AuthRepository using Supabase.
 */
@Injectable()
export class SupabaseAuthRepository extends AuthRepository {
  constructor(
    @Inject(SupabasePersistenceService) private readonly persistence: SupabasePersistenceService
  ) {
    super();
  }

  async login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }> {
    const { data, error } = await this.persistence.signIn(email, password);

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    const profile = await this.persistence.getProfile(data.user.id);
    const user = new User(
      data.user.id,
      data.user.email!,
      profile?.username,
      profile?.avatar_url
    );
    const token = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    return { user, token, refreshToken };
  }

  async register(name: string, email: string, password: string, username: string): Promise<{ user: User; token?: string; refreshToken?: string }> {
    const { data, error } = await this.persistence.signUp(email, password, name);

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'Registration failed');
    }

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    try {
      await this.persistence.createProfile(data.user.id, username, avatarUrl);
    } catch (profileError: any) {
      console.error(`[SupabaseAuthRepository] Profile creation failed for user ${data.user.id}: ${profileError.message}`);
    }

    const user = new User(data.user.id, data.user.email!, username, avatarUrl);
    const token = data.session?.access_token;
    const refreshToken = data.session?.refresh_token;

    return { user, token, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    const { data, error } = await this.persistence.refreshSession(refreshToken);

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Failed to refresh session');
    }

    return {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    let profile = await this.persistence.getProfile(id);
    const authUser = await this.persistence.getAuthUser(id);

    if (!profile && !authUser) {
      return null;
    }

    if (!profile && authUser) {
      const metadata = authUser.metadata || {};
      const fullName = metadata.full_name as string;
      const avatarUrl = metadata.avatar_url as string || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
      let username = fullName;
      if (!username) {
        const emailPrefix = authUser.email.split('@')[0];
        username = `${emailPrefix}_${Math.floor(Math.random() * 1000)}`;
      }

      try {
        await this.persistence.createProfile(id, username, avatarUrl);
        profile = { username, avatar_url: avatarUrl };
      } catch (err) {
        console.error('[SupabaseAuthRepository] Failed to auto-create profile:', err);
      }
    }

    return new User(
      id,
      authUser?.email || '',
      profile?.username,
      profile?.avatar_url
    );
  }
}
