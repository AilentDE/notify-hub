import { Hono } from "hono";
import webhookController from "../controllers/webhook-controller";

const router = new Hono();

router.get("/", webhookController.getWebhooks);
router.put("/", webhookController.upsertWebhook);
router.delete("/:id", webhookController.deleteWebhook);

export default router;
