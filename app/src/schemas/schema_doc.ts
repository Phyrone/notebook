import { z } from 'zod';
import { NDocumentV1 } from '$schemas/schema_doc_v1';

export const DocSchemaVersion = 1;

export const NDocumentSchema1Base = z.object({
	schemaVersion: z.literal(DocSchemaVersion)
});

export const NDocument = z.discriminatedUnion('type', [NDocumentV1]).and(NDocumentSchema1Base);

export type NDocument = z.infer<typeof NDocument>;
