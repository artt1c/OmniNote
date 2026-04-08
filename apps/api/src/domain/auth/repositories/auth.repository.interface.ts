import { User } from '../entities/user.entity';

/**
 * Interface for Authentication Repository.
 * Defines the contract for auth-related operations.
 */
export abstract class AuthRepository {
  /**
   * Performs a login operation and returns a user and session token.
   * @param email User email
   * @param password User password
   */
  abstract login(email: string, password: string): Promise<{ user: User; token: string }>;

  /**
   * Performs a registration operation and returns a user.
   * @param name User's full name
   * @param email User email
   * @param password User password
   */
  abstract register(name: string, email: string, password: string): Promise<{ user: User }>;
}
