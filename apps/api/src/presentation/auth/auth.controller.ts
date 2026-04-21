import { Controller, Post, Get, Body, HttpCode, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { GetMeUseCase } from '../../application/auth/use-cases/get-me.use-case';
import { RefreshUseCase } from '../../application/auth/use-cases/refresh.use-case';
import { LoginInput, LoginOutput } from '../../application/auth/dto/login.dto';
import { RegisterInput, RegisterOutput } from '../../application/auth/dto/register.dto';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { User } from './decorators/user.decorator';

/**
 * Controller for Authentication endpoints.
 * Handles incoming HTTP requests and delegates to use cases.
 */
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(LoginUseCase) private readonly loginUseCase: LoginUseCase,
    @Inject(RegisterUseCase) private readonly registerUseCase: RegisterUseCase,
    @Inject(GetMeUseCase) private readonly getMeUseCase: GetMeUseCase,
    @Inject(RefreshUseCase) private readonly refreshUseCase: RefreshUseCase,
  ) { }

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

  /**
   * Endpoint for retrieving the currently authenticated user.
   * @param user The user payload from the token
   */
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@User() user: { id: string }): Promise<any> {
    return this.getMeUseCase.execute(user.id);
  }

  /**
   * Endpoint for refreshing the user session.
   * @param body Payload containing the refresh token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }): Promise<any> {
    return this.refreshUseCase.execute(body.refreshToken);
  }
}
