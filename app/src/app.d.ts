// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SessionData } from '$scripts/session_auth.server';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Promise<SessionData | undefined>;
			locale: string | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {}
	}
}

export {};
