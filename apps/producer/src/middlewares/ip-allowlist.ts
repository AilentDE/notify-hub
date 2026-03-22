import { Resource } from "sst";
import { createMiddleware } from "hono/factory";

/**
 * IP allowlist middleware using Cloudflare KV.
 * Checks if the requesting IP has a persistent key `allowed_ip:<ip>` in KV.
 * Manage allowed IPs via Cloudflare Dashboard (no TTL, persistent).
 */
export const ipAllowlist = () => {
  return createMiddleware(async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const key = `allowed_ip:${ip}`;
    const allowed = await Resource.NotifyHubKV.get(key);

    if (!allowed) {
      return c.text("Forbidden", 403);
    }

    await next();
  });
};
