import { User } from '../../../domain/auth/entities/user.entity';

/**
 * Data Transfer Object for Register input.
 */
export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

/**
 * Data Transfer Object for Register output.
 */
export interface RegisterOutput {
  user: User;
}
