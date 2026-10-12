import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/mediconnect_dev?schema=public'),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters long').default(
    'mediconnect_default_secret_key_at_least_32_characters_long_min'
  ),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid backend environment configuration:');
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
  throw new Error('Environment configuration error');
}

export const env = parsed.data;
