import { Hono } from "hono";
import webhookController from "../controllers/webhook-controller";

const router = new Hono();

router.get("/", webhookController.testDb);

export default router;
