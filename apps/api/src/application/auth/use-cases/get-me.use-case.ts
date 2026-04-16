import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';
import { User } from '../../../domain/auth/entities/user.entity';

/**
 * Use case for retrieving the currently authenticated user's profile.
 */
@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Fetches the user profile by ID.
   * @param userId The ID of the user to fetch
   */
  async execute(userId: string): Promise<{ user: User }> {
    const user = await this.authRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }
}
