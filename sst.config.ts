/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "notify-hub",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    // 1. D1 database
    const db = new sst.cloudflare.D1("NotifyHubDb");
    // 2. Message queue
    const queue = new sst.cloudflare.Queue("NotifyHubQueue");

    // Consumer
    queue.subscribe({
      handler: "apps/consumer/src/worker.ts",
      link: [db],
    });
    // Producer
    const api = new sst.cloudflare.Worker("NotifyHubApi", {
      url: true,
      handler: "apps/producer/src/api.ts",
      link: [db, queue],
    });

    return { ApiEndpoint: api.url };
  },
});
