import 'dotenv/config';
import { parseEnv } from 'znv';
import { env } from '$env/dynamic/private';
import { z } from 'zod';

export const { DATABASE_URL, DATABASE_RO_URL } = parseEnv(env, {
	DATABASE_URL: z.string().url().startsWith('postgres://'),
	DATABASE_RO_URL: z.string().url().startsWith('postgres://').optional()
});
