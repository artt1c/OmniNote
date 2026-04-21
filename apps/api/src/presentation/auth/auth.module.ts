import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginUseCase } from '../../application/auth/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/auth/use-cases/register.use-case';
import { GetMeUseCase } from '../../application/auth/use-cases/get-me.use-case';
import { RefreshUseCase } from '../../application/auth/use-cases/refresh.use-case';
import { AuthRepository } from '../../domain/auth/repositories/auth.repository.interface';
import { SupabaseAuthRepository } from '../../infrastructure/auth/repositories/supabase-auth.repository';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetMeUseCase,
    RefreshUseCase,
    {
      provide: AuthRepository,
      useClass: SupabaseAuthRepository,
    },
  ],
  exports: [LoginUseCase, RegisterUseCase, GetMeUseCase, RefreshUseCase],
})
export class AuthModule { }
