import { z } from 'zod';

const commentSchemaValidation = z.object({
  comment: z.string(),
});

export const commentValidations = {
  commentSchemaValidation,
};
