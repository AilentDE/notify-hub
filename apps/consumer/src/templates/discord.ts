import { LogMessage } from "@notify-hub/core";

const DiscordMessage = (message: LogMessage) => {
  return {
    username: "Notify Hub",
    embeds: [
      {
        author: {
          name: message.details?.author ?? "Notify Worker",
        },
        title: message.title,
        color: message.details?.color ?? 15158332,
        fields: [
          { name: "Message", value: message.message },
          { name: "URL", value: message.url ?? "N/A" },
          { name: "Details", value: JSON.stringify(message.details) },
          {
            name: "Occurred At",
            value: new Date(message.occurredAt).toISOString(),
          },
          {
            name: "Received At",
            value: new Date(message.receivedAt).toISOString(),
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
};

export default DiscordMessage;
