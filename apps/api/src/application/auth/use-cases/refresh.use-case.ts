import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) { }

  /**
   * Refreshes the session using a refresh token.
   * @param refreshToken The refresh token
   */
  async execute(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return this.authRepository.refresh(refreshToken);
  }
}
