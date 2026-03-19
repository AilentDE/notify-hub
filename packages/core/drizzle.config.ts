import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./models/**/*.ts",
  out: "./migrations",
  dialect: "sqlite",
  strict: true,
  verbose: true,
});
