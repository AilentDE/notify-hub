import { Resource } from "sst";
import { createDb } from "@notify-hub/core";

let db: ReturnType<typeof createDb>;

export const getDb = () => {
  if (!db) {
    db = createDb(Resource.NotifyHubDb);
  }
  return db;
};
