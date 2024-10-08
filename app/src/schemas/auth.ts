import { z } from 'znv';
import { Base36BigInt } from '$schemas/misc';
import type { Writable } from 'svelte/store';

export const SessionDataContext = 'session';
export type ContextSessionDataType = Writable<MaybeSessionData>;

export const SessionData = z.object({
	id: Base36BigInt,
	email: z.string().email().optional()
});
export type SessionData = z.infer<typeof SessionData>;
export const MaybeSessionData = SessionData.optional();
export type MaybeSessionData = z.infer<typeof MaybeSessionData>;
