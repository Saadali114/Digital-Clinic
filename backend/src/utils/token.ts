import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';
import type { SessionPayload } from '../types/index.js';

const SECRET_KEY = new TextEncoder().encode(env.AUTH_SECRET);
const TOKEN_EXPIRY = '7d';
const TOKEN_ISSUER = 'mediconnect-backend';

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(TOKEN_ISSUER)
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      issuer: TOKEN_ISSUER,
    });

    if (
      !payload.userId ||
      !payload.email ||
      !payload.role ||
      typeof payload.userId !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: (payload.name as string) || '',
      role: payload.role as SessionPayload['role'],
      status: (payload.status as SessionPayload['status']) || 'ACTIVE',
    };
  } catch {
    return null;
  }
}
