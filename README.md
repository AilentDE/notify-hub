# NOTIFY-HUB

> 轉發社群通知的 Cloudflare Worker 服務

NOTIFY-HUB 是一個部署在 Cloudflare Workers 上的輕量通知轉發系統。Producer 接收應用程式送來的日誌訊息，透過 Cloudflare Queue 非同步傳遞給 Consumer，Consumer 再依設定的 Webhook 端點（Discord、Teams 等）轉發出去。

## 架構

```
應用程式
  │  POST /log
  ▼
Producer Worker  ──→  Cloudflare Queue  ──→  Consumer Worker
(Hono API)                                    (處理 & 轉發)
  │                                                │
  └──────────────── D1 Database ──────────────────┘
                  (Webhook 設定)
```

| 元件                           | 說明                                      |
| ------------------------------ | ----------------------------------------- |
| **Producer** (`apps/producer`) | 接收 `POST /log` 請求，將訊息推入 Queue   |
| **Consumer** (`apps/consumer`) | 訂閱 Queue，將訊息轉發至對應的 Webhook    |
| **Core** (`packages/core`)     | 共用 schema、型別定義（Drizzle + Zod）    |
| **D1**                         | 儲存 Webhook 設定（endpoint、類型）       |
| **Queue**                      | 非同步傳遞訊息，解耦 Producer 與 Consumer |

## 支援的通知目標

- Discord Webhook
- Microsoft Teams Webhook

## 技術棧

- [SST v4](https://sst.dev/) — Cloudflare 資源管理與本地開發
- [Cloudflare Workers](https://workers.cloudflare.com/) — Serverless 執行環境
- [Cloudflare Queue](https://developers.cloudflare.com/queues/) — 訊息佇列
- [Cloudflare D1](https://developers.cloudflare.com/d1/) — SQLite 資料庫
- [Hono](https://hono.dev/) — 輕量 Web Framework
- [Drizzle ORM](https://orm.drizzle.team/) + [drizzle-zod](https://orm.drizzle.team/docs/zod) — 型別安全的資料庫存取
- [pnpm Workspaces](https://pnpm.io/workspaces) — Monorepo 套件管理

## 前置需求

- Node.js 18+
- pnpm
- Cloudflare 帳號，並準備好具有以下權限的 API Token：
  - Workers Agents Configuration: Edit
  - Workers Scripts: Edit
  - Queues: Edit
  - D1: Edit

## 環境設定

在專案根目錄建立 `.env`：

```env
CLOUDFLARE_API_TOKEN=<your_api_token>
CLOUDFLARE_DEFAULT_ACCOUNT_ID=<your_account_id>
```

## 安裝依賴

```bash
pnpm install
```

## D1 Migration（Drizzle + Wrangler）

以下流程可把 `packages/core/schema.ts` 轉成 migration，並套用到既有的 Cloudflare D1 資料庫。

1. 在 `packages/core/drizzle.config.ts` 設定 migration 輸出目錄：

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  strict: true,
  verbose: true,
});
```

2. 在 `packages/core/wrangler.toml` 設定 D1 連線與 migration 目錄（`database_id` 請替換成 Cloudflare D1 頁面的 UUID）：

```toml
name = "notify-hub-db-migrations"
compatibility_date = "2026-03-19"

[[d1_databases]]
binding = "DB"
database_name = "<your-d1-database-name>"
database_id = "<your-d1-database-id>"
migrations_dir = "migrations"
```

3. 產生 migration SQL：

```bash
pnpm db:generate
pnpm db:generate:named --name=create_webhook_table
```

4. 套用到 remote D1：

```bash
pnpm db:migrate
```

5. 檢查 migration 與資料表：

```bash
pnpm db:migrations:list
pnpm db:verify:tables
```

可用 scripts（在專案根目錄執行）：

```bash
pnpm db:generate         # 由 schema 產生 migration SQL（自動命名）
pnpm db:generate:named --name=create_webhook_table  # 指定 migration 名稱
pnpm db:migrate          # 套用 migration 到 remote D1
pnpm db:migrations:list  # 查看未套用 migration
pnpm db:verify:tables    # 檢查目前資料表
```

## 開發

```bash
npx sst dev
```

啟動後會輸出 API 端點 URL，可對其發送請求測試：

```bash
curl -X POST <ApiEndpoint>/log \
  -H "Content-Type: application/json" \
  -d '{
    "type": "API_ERROR",
    "message": "Something went wrong",
    "url": "https://example.com/api",
    "occurredAt": "2026-03-18T00:00:00.000Z"
  }'
```

## 部署

```bash
npx sst deploy --stage production
```

## 清除資源

```bash
npx sst remove
```

> `production` stage 的資源受保護，不會被自動刪除。

## 專案結構

```
notify-hub/
├── apps/
│   ├── producer/       # Producer Worker（Hono API）
│   └── consumer/       # Consumer Worker（Queue 訂閱處理）
├── packages/
│   └── core/           # 共用型別、schema
├── sst.config.ts       # SST 資源定義
└── pnpm-workspace.yaml
```
