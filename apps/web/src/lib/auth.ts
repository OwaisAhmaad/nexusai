'use server';

import { cookies } from 'next/headers';

export function getAccessToken(): string | undefined {
  return cookies().get('access_token')?.value;
}

export function setTokenCookies(accessToken: string) {
  cookies().set('access_token', accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60,
    path: '/',
  });
}

export function clearTokenCookies() {
  cookies().delete('access_token');
}
