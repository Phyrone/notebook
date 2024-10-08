import { serial, varchar, text, timestamp, pgTable, bigserial } from 'drizzle-orm/pg-core';
import { bytea } from './types';
//import {createInsertSchema, createSelectSchema} from 'drizzle-zod';

export const users_table = pgTable('user', {
	//the id of the user
	id: bigserial('id', { mode: 'bigint' }).notNull().primaryKey(),
	//the display name for the user other users will see
	name: text('name').notNull(),
	//the email address for the user to login with needs to be unique
	//OAuth2 providers might merge if the email is the same
	//if null no login with email is possible (f.e. via OAuth2)
	email: text('email').unique(),
	//timestamp when the email got verified by the user
	//null if the email is not verified
	//null if the email changes and is not verified yet
	emailVerified: timestamp('email_verified'),
	//a password for the user to login with
	//normally hashed with argon2id other might be possible in the future
	//null if no auth via password is possible (f.e. via OAuth2, WebAuthn, Single Sign On)
	password: text('password'),
	//secret used to sign the session token for the user to authenticate
	//changing this invalidates all session tokens of the user
	//WARNING: this is not the session token itself it is a secret to sign the session token do not expose it
	session_secret: bytea('session'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow()
});
