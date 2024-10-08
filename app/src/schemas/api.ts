import { z } from 'zod';

export const ResponseBase = z.object({
	success: z.boolean()
});

export const ResponseSuccessBase = ResponseBase.extend({
	success: z.literal(true)
});
export type ResponseSuccessBase = z.infer<typeof ResponseSuccessBase>;
