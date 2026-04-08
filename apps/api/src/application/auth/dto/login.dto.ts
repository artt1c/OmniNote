import { User } from '../../../domain/auth/entities/user.entity';

/**
 * Data Transfer Object for Login input.
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Data Transfer Object for Login output.
 */
export interface LoginOutput {
  user: User;
  token: string;
}
