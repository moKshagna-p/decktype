import type { ObjectId } from "mongodb";

export type RecordLeaderboardResultInput = {
  userId: ObjectId;
  gameId: ObjectId;
  difficulty: string;
  bestScore: number;
  displayName: string;
  createdAt: Date;
};

export type GetLeaderboardInput = {
  gameId: ObjectId;
  difficulty?: string;
  limit: number;
};
