export const ACCESS_TOKEN_STORAGE_KEY = 'tb.token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function setAccessToken(accessToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}
