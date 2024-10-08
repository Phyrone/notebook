import postgres from 'postgres';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { building } from '$app/environment';
import { DATABASE_RO_URL, DATABASE_URL } from '$lib/server/config';

if (building) throw 'database module must not be imported during build time, only during runtime';

const options = {
	ssl: 'allow',
	types: {
		bigint: postgres.BigInt
	}
} satisfies postgres.Options<{ bigint: postgres.PostgresType<bigint> }>;

export const sql = postgres(DATABASE_URL, {
	...options
});

(async () => {
	const CONSOLE_TIME_KEY = '[DB] Migrate database';
	try {
		console.time(CONSOLE_TIME_KEY);
		await migrate(
			drizzle(
				postgres(DATABASE_URL, {
					max: 1,
					...options
				}),
				{ logger: false }
			),
			{
				migrationsFolder: './drizzle',
				migrationsTable: 'schema_version'
			}
		);
	} finally {
		console.timeEnd(CONSOLE_TIME_KEY);
	}
})();

export const sql_ro = DATABASE_RO_URL
	? postgres(DATABASE_RO_URL, {
			target_session_attrs: 'prefer-standby',
			...options
		})
	: sql;

export const db = drizzle(sql, { logger: false });
export const db_ro = DATABASE_RO_URL ? drizzle(sql_ro, { logger: false }) : db;
