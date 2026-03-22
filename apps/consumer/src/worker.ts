import { logMessageSchema } from "@notify-hub/core";
import sendMessage from "./controllers/message-controller";

export default {
  async queue(batch: MessageBatch<any>) {
    for (const message of batch.messages) {
      const parsedMessage = logMessageSchema.safeParse(message.body);
      if (!parsedMessage.success) {
        console.error("Invalid message:", parsedMessage.error);
        message.ack();
        continue;
      }

      await sendMessage(parsedMessage.data);

      message.ack();
    }
  },
};
