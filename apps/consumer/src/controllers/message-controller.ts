import { LogMessage, webhooksTable } from "@notify-hub/core";
import { and, like, eq } from "drizzle-orm";
import { getDb } from "../lib/db";
import { matchOrigin } from "../utils/url-matcher";
import sendDiscordMessage from "../services/discord-message-service";

const sendMessage = async (message: LogMessage) => {
  if (!message.url) {
    throw new Error("For now, we only support direct webhook.");
  }

  // Extract scheme + host as a prefix for the SQL LIKE query
  const urlObj = new URL(message.url);
  const hostPrefix = `${urlObj.protocol}//${urlObj.host}`;

  const db = getDb();
  const candidates = await db
    .select()
    .from(webhooksTable)
    .where(
      and(
        like(webhooksTable.origin, `${hostPrefix}%`),
        eq(webhooksTable.isCanceled, false),
      ),
    );
  // Filter with wildcard matching in JS
  const matchedWebhooks = candidates.find((w) =>
    matchOrigin(w.origin, message.url!),
  );
  if (!matchedWebhooks) {
    console.error("No webhook found for the given URL");
    return;
  }

  switch (matchedWebhooks.category) {
    case "DISCORD":
      await sendDiscordMessage(matchedWebhooks.endpoint, message);
      break;
    default:
      console.info("Unsupported category", matchedWebhooks.category);
  }
};

export default sendMessage;
