import { z } from 'zod';
/// The AST for a document version 1 (NDocumentV1)
/// It is a simple document tree with elements that can be text images etc.

export const NDocumentElementBaseV1 = z.object({
	id: z.string()
});
export const NDocumentV1ElementText = z
	.object({
		type: z.literal('text'),
		value: z.string()
	})
	.extend(NDocumentElementBaseV1.shape);

export type NDocumentV1ElementText = z.infer<typeof NDocumentV1ElementText>;

export const NDocumentV1Element = z
	.discriminatedUnion('type', [NDocumentV1ElementText])
	.and(NDocumentElementBaseV1);

export type NDocumentV1Element = z.infer<typeof NDocumentV1Element>;

export const NDocumentV1 = z.object({
	type: z.literal('doc1'),
	title: z.string().optional(),
	elements: z.array(NDocumentV1Element)
});

export type NDocumentV1 = z.infer<typeof NDocumentV1>;
