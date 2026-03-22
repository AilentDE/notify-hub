import { Resource } from "sst";
import { createMiddleware } from "hono/factory";

const RATE_LIMIT = 600; // 600 requests per 60s window (~10 req/sec average)
const WINDOW_SECONDS = 60;
const KV_TTL_SECONDS = 60; // Cloudflare KV minimum TTL is 60s

/**
 * Rate limiter middleware using Cloudflare KV.
 * Limits each IP to RATE_LIMIT requests per WINDOW_SECONDS second(s).
 */
export const rateLimiter = () => {
  return createMiddleware(async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const now = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
    const key = `ratelimit:${ip}:${now}`;

    const current = await Resource.NotifyHubKV.get(key);
    const count = current ? parseInt(current, 10) : 0;

    if (count >= RATE_LIMIT) {
      return c.text("Too Many Requests", 429);
    }

    await Resource.NotifyHubKV.put(key, String(count + 1), {
      expirationTtl: KV_TTL_SECONDS,
    });

    await next();
  });
};
