import type { ObjectId } from "mongodb";

export type CreateResultInput = {
  userId: ObjectId;
  gameId: ObjectId;
  score: number;
  difficulty: string;
};

export type GetUserResultsInput = {
  userId: ObjectId;
  gameId?: ObjectId;
  limit: number;
};

export type CreateResultContext = {
  displayName: string;
};
