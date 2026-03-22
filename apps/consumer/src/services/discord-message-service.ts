import { LogMessage } from "@notify-hub/core";
import DiscordMessage from "../templates/discord";

const sendDiscordMessage = async (webhookUrl: string, message: LogMessage) => {
  const payload = DiscordMessage(message);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Failed to send Discord message: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Failed to send Discord message:", error);
  }
};

export default sendDiscordMessage;
