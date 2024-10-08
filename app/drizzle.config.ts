import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/database/*',
	out: './drizzle/',
	breakpoints: true,
	dbCredentials: {
		//@ts-ignore
		url: process.env.DATABASE_URL
	}
});
