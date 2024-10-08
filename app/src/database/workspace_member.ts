import { bigserial, pgEnum, pgTable, primaryKey, serial, timestamp } from 'drizzle-orm/pg-core';
import { workspaces_table } from './workspaces_table';
import { users_table } from './users_table';

export const workspace_member_roles = pgEnum('workspace_member_role', ['owner', 'admin', 'member']);

export const workspace_memberst_table = pgTable(
	'workspace_member',
	{
		workspace_id: bigserial('workspace_id', { mode: 'bigint' }).references(
			() => workspaces_table.id
		),
		user_id: bigserial('user_id', { mode: 'bigint' }).references(() => users_table.id),
		joined_at: timestamp('joined_at').defaultNow(),
		role: workspace_member_roles('role').notNull().default('member')
	},
	(table) => {
		return {
			pk: primaryKey({
				columns: [table.workspace_id, table.user_id]
			})
		};
	}
);
