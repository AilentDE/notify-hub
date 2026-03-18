// import { LogMessage } from "@notify-hub/core";

export default {
  async queue(batch: MessageBatch<any>) {
    for (const message of batch.messages) {
      console.log("Processing message:", message);

      await message.ack();
    }
  },
};
