/**
 * Domain entity representing a User.
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}
}
