# AGENTS.md — AI coding assistant context

> This file provides structured context for AI coding agents (Claude, Codex, Cursor, Copilot, etc.).

## What this repo is

A minimal Node.js + Express demo showing how to add Elastic Observability via **EDOT** (Elastic Distribution of OpenTelemetry) with **zero code changes** to the app. The entire point is that `app.js` stays untouched — EDOT is injected at startup via a `--import` flag.

The home page (`public/index.html`) is a traffic generator that lets visitors create traces, metrics, logs and errors by clicking controls. It also detects whether EDOT is configured and shows a setup banner if not.

## Tech stack

- **Runtime**: Node.js ≥ 20.6 (ESM, `"type": "module"`)
- **Framework**: Express 5
- **Logging**: pino (JSON to stdout, no transports)
- **Observability SDK**: `@elastic/opentelemetry-node` (EDOT) — **not in package.json**, installed separately
- **Backend**: Elastic Cloud Serverless (OTLP over HTTPS)

## Project structure

```
app.js              # Express app — intentionally kept minimal, do not add complexity here
public/index.html   # Traffic generator landing page
public/style.css    # EUI-inspired plain CSS
public/app.js       # Client-side traffic generator logic (no framework, no build step)
package.json        # Dependencies: express and pino only
.env.example        # Template for OTEL environment variables
```

## Commands

```bash
# Install dependencies
npm install

# Run without observability
npm start

# Run with EDOT (requires .env with your Elastic credentials)
npm run start:edot

# Run with EDOT using explicit env vars
node --import @elastic/opentelemetry-node app.js
```

## Endpoints

| Route | Behaviour |
|---|---|
| `GET /` | Traffic generator page |
| `GET /api/hello` | Returns `{ ok: true }` |
| `GET /api/slow` | Waits 300–900 ms, returns `{ ok: true, ms }` |
| `GET /api/error` | Throws an Error (demonstrates error capture), returns 500 |
| `GET /api/chain` | Fetches `/api/hello` with global fetch (outbound HTTP span in same trace) |
| `POST /api/log` | Accepts `{ message }` body, writes a pino log line, returns `{ ok: true }` |
| `GET /api/status` | Returns `{ configured: boolean, serviceName: string\|null, language: string }` — used by the frontend to detect if EDOT env vars are set |

## Frontend behaviour

- On load, the frontend calls `/api/status`. If `configured` is `false`, an amber banner prompts the user to follow setup steps. If `serviceName` is present, it is shown in the header subtitle.
- **Send request** fires a random mix of `/api/hello` (60%) and `/api/slow` (40%), optionally including `/api/error` (~10%) when the toggle is on.
- **Outbound call** hits `/api/chain`, which makes an internal fetch to `/api/hello` — demonstrates a nested outbound HTTP span in the same trace.
- **Auto rate** slider sets req/s; **Start** / **Stop** buttons control whether auto traffic is running.
- **Log message** input submits to `POST /api/log`; the message text is shown inline in the activity list and the log entry is visually distinguished.

## Reusability across languages

The frontend (`public/`) is intentionally language-agnostic. To create an equivalent Python, Java, or Go demo, implement the same seven endpoints (including `/api/status` returning `{ configured, serviceName, language }`). The frontend will work without modification.

## Environment variables (all OTEL-standard)

See `.env.example` for the full list. The required ones:

```
OTEL_EXPORTER_OTLP_ENDPOINT          # Your Elastic OTLP ingest endpoint URL
OTEL_EXPORTER_OTLP_HEADERS           # Authorization=ApiKey <your-key>
OTEL_SERVICE_NAME                    # Name shown in Kibana → Observability → Services
ELASTIC_OTEL_NODE_ENABLE_LOG_SENDING # Set to true to forward pino logs to Elastic
```

## Key constraints for agents

- **Do not import or configure EDOT in `app.js`** — the whole demo is that the app is untouched. The SDK is loaded via `--import @elastic/opentelemetry-node` only.
- **`@elastic/opentelemetry-node` is intentionally absent from `package.json`** — it is installed by the user as a separate step when they want to connect to Elastic.
- **Do not add a `.env` file** to version control — use `.env.example` as the template only.
- `app.js` uses ESM (`import`) — do not convert to CommonJS (`require`).
- Node.js ≥ 20.6 is required for `--env-file` support.
- The frontend (`public/`) uses plain HTML, CSS and JS — no framework, no build step.
- `console.log` is not collected by EDOT. Logs must go through pino.
- `/api/status` checks `OTEL_EXPORTER_OTLP_ENDPOINT` and `OTEL_EXPORTER_OTLP_HEADERS` to determine `configured`. Do not check for the EDOT package in `node_modules` — the env vars are the reliable signal.

## Where to find things

- EDOT Node.js SDK: `@elastic/opentelemetry-node` on npm / GitHub: `elastic/elastic-otel-node`
- EDOT setup docs: https://www.elastic.co/docs/reference/opentelemetry/edot-sdks/node/setup
- Elastic Observability UI: Kibana → Observability → Services
- OTLP connection details: Elastic Cloud → your project → Add data → Application → OpenTelemetry
