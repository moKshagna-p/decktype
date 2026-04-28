import { recordLeaderboardResult } from "../leaderboard/service";
import { resultsDAL } from "./dal";
import { serializeResult } from "./serializers";
import type {
  CreateResultContext,
  CreateResultInput,
  GetUserResultsInput,
} from "./types";

export const createResult = async (
  input: CreateResultInput,
  { displayName }: CreateResultContext,
) => {
  const doc = await resultsDAL.create({
    ...input,
    createdAt: new Date(),
  });

  const isNewPB = await recordLeaderboardResult({
    userId: doc.userId,
    gameId: doc.gameId,
    difficulty: doc.difficulty,
    bestScore: doc.score,
    displayName,
    createdAt: doc.createdAt,
  });

  return {
    ...serializeResult(doc),
    isNewPB,
  };
};

export const getUserResults = async (filters: GetUserResultsInput) => {
  const docs = await resultsDAL.findByUser(filters);
  return docs.map(serializeResult);
};
