import { Hono } from "hono";
import webhookController from "../controllers/webhook-controller";
import { ipAllowlist } from "../middlewares/ip-allowlist";

const router = new Hono();

router.use("*", ipAllowlist());
router.get("/", webhookController.getWebhooks);
router.put("/", webhookController.upsertWebhook);
router.delete("/:id", webhookController.deleteWebhook);

export default router;
