import { ObjectId } from "mongodb";

import { ApiError } from "./errors";

export const parseObjectId = (value: string) => {
  if (!ObjectId.isValid(value)) {
    throw ApiError.badRequest("Invalid id or ids.");
  }

  return new ObjectId(value);
};
