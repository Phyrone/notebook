import { randomBytes } from 'crypto';

export function secure_random_string(length: number): string {
	return randomBytes(length).toString('base64');
}
export function secure_random_bytes(length: number): Buffer {
	return randomBytes(length);
}
