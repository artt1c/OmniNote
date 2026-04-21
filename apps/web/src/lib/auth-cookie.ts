import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
};

export function setAuthCookie(token: string, refreshToken?: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, token, COOKIE_OPTIONS);
  if (refreshToken) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
  }
}

export function getAuthCookie(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshTokenCookie(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

export function removeAuthCookie(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}
