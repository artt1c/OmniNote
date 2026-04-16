import { Injectable, Inject } from '@nestjs/common';
import { AuthRepository } from '../../../domain/auth/repositories/auth.repository.interface';
import { RegisterInput, RegisterOutput } from '../dto/register.dto';

/**
 * Use case for registering a user.
 * Implements the application logic for user signup.
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AuthRepository) private readonly authRepository: AuthRepository,
  ) {}

  /**
   * Orchestrates the registration operation.
   * @param input Registration details
   */
  async execute(input: RegisterInput): Promise<RegisterOutput> {
    return this.authRepository.register(input.name, input.email, input.password, input.username);
  }
}
