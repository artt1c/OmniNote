import { User } from '../entities/user.entity';

/**
 * Interface for Authentication Repository.
 * Defines the contract for auth-related operations.
 */
export abstract class AuthRepository {
  /**
   * Performs a login operation and returns a user and session tokens.
   * @param email User email
   * @param password User password
   */
  abstract login(email: string, password: string): Promise<{ user: User; token: string; refreshToken: string }>;

  /**
   * Performs a registration operation and returns a user and tokens.
   * @param name User's full name
   * @param email User email
   * @param password User password
   * @param username User's unique username
   */
  abstract register(name: string, email: string, password: string, username: string): Promise<{ user: User; token?: string; refreshToken?: string }>;
  
  /**
   * Refreshes the session using a refresh token.
   * @param refreshToken The refresh token
   */
  abstract refresh(refreshToken: string): Promise<{ token: string; refreshToken: string }>;

  /**
   * Fetches a user by their ID, including profile information.
   * @param id User ID
   */
  abstract getUserById(id: string): Promise<User | null>;
}
