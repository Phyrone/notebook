import { bigserial, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const workspaces_table = pgTable('workspace', {
	id: bigserial('id', { mode: 'bigint' }).primaryKey(),
	name: varchar('name').unique(),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
