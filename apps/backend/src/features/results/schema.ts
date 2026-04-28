import { t } from "elysia";

export const createResultBodySchema = t.Object({
  gameId: t.String(),
  score: t.Number(),
  difficulty: t.String({ minLength: 1 }),
});

export const myResultsQuerySchema = t.Object({
  gameId: t.Optional(t.String()),
  limit: t.Optional(t.Numeric({ minimum: 1, maximum: 100, default: 20 })),
});

// Base schema for shared properties
const baseResultSchema = {
  id: t.String(),
  userId: t.String(),
  gameId: t.String(),
  score: t.Number(),
  difficulty: t.String(),
  createdAt: t.Date(),
};

export const resultResponseSchema = t.Object({
  ...baseResultSchema,
});

export const createResultResponseSchema = t.Object({
  ...baseResultSchema,
  isNewPB: t.Boolean(),
});
