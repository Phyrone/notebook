import DataLoader, { type CacheMap } from 'dataloader';
import { users_table } from '$database/users_table';
import { inArray } from 'drizzle-orm';
import NodeCache from 'node-cache';
import { db_ro } from '$lib/server/database/sql';

/*
export type UsersData = {
	email: string | null;
	id: bigint;
	name: string;
	emailVerified: Date | null;
	password: string | null;
	session_secret: Buffer | null;
	createdAt: Date | null;
	updatedAt: Date | null;
};

 */
export type UsersData = typeof users_table.$inferSelect;

export const user_data_cache = new NodeCache({
	stdTTL: 10,
	maxKeys: 16 * 1024,
	useClones: false,
	errorOnMissing: false,
	deleteOnExpire: true,
	checkperiod: 60,
	forceString: false
});
const cacheMap: CacheMap<bigint, any> = {
	get(key: bigint): void | UsersData {
		return user_data_cache.get(key.toString());
	},
	set(key: bigint, value: UsersData): any {
		user_data_cache.set(key.toString(), value);
	},
	delete(key: bigint): any {
		return user_data_cache.take(key.toString());
	},
	clear(): any {
		user_data_cache.flushAll();
	}
};
export const user_data_loader = new DataLoader<bigint, UsersData | undefined>(
	async (ids) => {
		const selected = await db_ro
			.select()
			.from(users_table)
			.where(inArray(users_table.id, [...ids]));
		const keyed_selected = new Map(selected.map((e) => [e.id, e]));
		return ids.map((id) => keyed_selected.get(id));
	},
	{
		cache: true,
		maxBatchSize: 128,
		batch: true,
		name: 'user_data_loader',
		cacheMap
	}
);
