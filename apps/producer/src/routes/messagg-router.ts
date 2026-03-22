import { Hono } from "hono";
import messageController from "../controllers/message-controller";
import { rateLimiter } from "../middlewares/rate-limiter";

const router = new Hono();

router.use("*", rateLimiter());
router.post("/", messageController.putMessage);

export default router;
