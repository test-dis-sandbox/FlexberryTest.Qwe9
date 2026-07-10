import { createPublicEnv } from 'next-public-env';

/**
 * Для внедрения runtime переменных в клиент.
 */
export const { getPublicEnv, PublicEnv } = createPublicEnv(
  {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  {
    schema: (z) => ({
      BACKEND_URL: z.string().url(),
    }),
  }
);
