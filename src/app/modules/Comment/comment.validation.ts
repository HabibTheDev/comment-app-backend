import { z } from 'zod';

const commentSchemaValidation = z.object({
  comment: z.string().nonempty('Comment is required'),
});
export const commentValidations = {
  commentSchemaValidation,
};
