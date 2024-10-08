import { z } from 'zod';

export const Base36BigInt = z
	.string()
	.toLowerCase()
	.regex(/^[0-9a-z]{1,13}$/i);

export function parse_bigint_base36(value: string) {
	return parse_bigint(value, 36);
}

export function parse_bigint(value: string, radix: number) {
	return [...value.toString()].reduce((r, v) => r * BigInt(radix) + BigInt(parseInt(v, radix)), 0n);
}
