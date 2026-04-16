import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';

// 7 day expiry, matching typical JWT expiry
const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
};

export function setAuthCookie(token: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, COOKIE_OPTIONS);
}

export function getAuthCookie(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function removeAuthCookie(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
}
