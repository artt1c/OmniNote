import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';
import { LoginInput, LoginOutput } from '../dto/login.dto';

/**
 * Use case for logging in a user.
 * Implements the application logic for authentication.
 */
@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Orchestrates the login operation.
   * @param input Login credentials
   */
  async execute(input: LoginInput): Promise<LoginOutput> {
    // In a more complex system, we might perform domain validation or additional orchestration here.
    return this.authRepository.login(input.email, input.password);
  }
}
