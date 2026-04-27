import { z } from 'zod';

export const RequestUploadBodySchema = z.object({
  fileData: z.object({
    fileName: z.string().min(1),
    mimeType: z.string().includes('/'),
    size: z.number().positive(),
    isPublic: z.boolean().default(false),
  }),
});

export type RequestUploadParams = z.infer<typeof RequestUploadBodySchema>['fileData'];
