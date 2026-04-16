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

    const profile = await this.persistence.getProfile(data.user.id);
    const user = new User(
      data.user.id,
      data.user.email!,
      profile?.username,
      profile?.avatar_url
    );
    const token = data.session.access_token;

    return { user, token };
  }

  async register(name: string, email: string, password: string, username: string): Promise<{ user: User; token?: string }> {
    const { data, error } = await this.persistence.signUp(email, password, name);

    if (error || !data.user) {
      throw new BadRequestException(error?.message || 'Registration failed');
    }

    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    try {
      await this.persistence.createProfile(data.user.id, username, avatarUrl);
    } catch (profileError: any) {
      console.error(`[SupabaseAuthRepository] Profile creation failed for user ${data.user.id}: ${profileError.message}`);
      // Re-throw if we want to fail registration when profile fails, 
      // but for now we keep it non-blocking as per current logic.
    }

    const user = new User(data.user.id, data.user.email!, username, avatarUrl);
    const token = data.session?.access_token;

    return { user, token };
  }

  async getUserById(id: string): Promise<User | null> {
    let profile = await this.persistence.getProfile(id);
    const authUser = await this.persistence.getAuthUser(id);

    if (!profile && !authUser) {
      return null;
    }

    // If authUser exists but profile doesn't (common for OAuth signups),
    // we should create a profile automatically using the OAuth metadata.
    if (!profile && authUser) {
      const metadata = authUser.metadata || {};
      const fullName = metadata.full_name as string;
      const avatarUrl = metadata.avatar_url as string || `https://api.dicebear.com/7.x/avataaars/svg?seed=${id}`;
      
      // Use full name if available, otherwise fallback to email prefix + random
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
