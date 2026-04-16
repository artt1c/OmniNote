import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { GetMeUseCase } from '../../application/auth/use-cases/get-me.use-case';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository.interface';
import { SupabaseAuthRepository } from '../../infrastructure/auth/repositories/supabase-auth.repository';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetMeUseCase,
    {
      provide: AuthRepository,
      useClass: SupabaseAuthRepository,
    },
  ],
  exports: [LoginUseCase, RegisterUseCase, GetMeUseCase],
})
export class AuthModule { }
