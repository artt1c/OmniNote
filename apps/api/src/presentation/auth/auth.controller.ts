import { Controller, Post, Body, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { LoginInput, LoginOutput } from '../../application/auth/dto/login.dto';
import { RegisterInput, RegisterOutput } from '../../application/auth/dto/register.dto';

/**
 * Controller for Authentication endpoints.
 * Handles incoming HTTP requests and delegates to use cases.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @Inject(RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
  ) {}

  /**
   * Endpoint for user login.
   * @param input Credentials
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() input: LoginInput): Promise<LoginOutput> {
    return this.loginUseCase.execute(input);
  }

  /**
   * Endpoint for user registration.
   * @param input Registration details
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() input: RegisterInput): Promise<RegisterOutput> {
    return this.registerUseCase.execute(input);
  }
}
