import { Hono } from "hono";
import messageController from "../controllers/message-controller";

const router = new Hono();

router.post("/", messageController.putMessage);

export default router;
