# AGENTS.md — AI coding assistant context

> This file provides structured context for AI coding agents (Claude, Codex, Cursor, Copilot, etc.).

## What this repo is

A minimal Node.js + Express demo showing how to add Elastic Observability via **EDOT** (Elastic Distribution of OpenTelemetry) with **zero code changes** to the app. The entire point is that `app.js` stays untouched — EDOT is injected at startup via a `--import` flag.

## Tech stack

- **Runtime**: Node.js ≥ 20.6 (ESM, `"type": "module"`)
- **Framework**: Express 5
- **Observability SDK**: `@elastic/opentelemetry-node` (EDOT)
- **Backend**: Elastic Cloud Serverless (OTLP over HTTPS)

## Project structure

```
app.js            # Express app — intentionally kept minimal, do not add complexity here
public/index.html # Animated landing page (static, served by Express)
package.json
.env.example      # Template for OTEL environment variables
```

## Commands

```bash
# Install dependencies
npm install

# Run without observability
npm start

# Run with EDOT (requires env vars — see .env.example)
node --import @elastic/opentelemetry-node app.js

# Run with EDOT using a .env file
node --env-file=.env --import @elastic/opentelemetry-node app.js
```

## Endpoints

| Route      | Behaviour                                         |
|------------|---------------------------------------------------|
| `GET /`    | Serves `public/index.html` (animated landing page)|
| `GET /hello` | Returns `{ "ok": true }`                        |
| `GET /weather` | Fetches live weather from Open-Meteo API (demonstrates outbound HTTP tracing) |
| `GET /oops`  | Throws an error (demonstrates error capture in Elastic Observability) |

## Environment variables (all OTEL-standard)

See `.env.example` for the full list with descriptions. The three required ones:

```
OTEL_EXPORTER_OTLP_ENDPOINT   # Your Elastic OTLP ingest endpoint URL
OTEL_EXPORTER_OTLP_HEADERS    # Authorization=ApiKey <your-key>
OTEL_SERVICE_NAME             # Name shown in Elastic Observability UI
```

## Key constraints for agents

- **Do not modify `app.js`** to import or configure EDOT — the whole demo is that the app is untouched.
- **Do not add a `.env` file** to version control — use `.env.example` as the template only.
- `app.js` uses top-level ESM (`import`/`export`) — do not convert to CommonJS (`require`).
- Node.js ≥ 20.6 is required for `--env-file` support.

## Where to find things

- EDOT Node.js SDK: `@elastic/opentelemetry-node` on npm / GitHub: `elastic/elastic-otel-node`
- Elastic Observability UI: Kibana → Observability → Services
- OTLP connection details: Elastic Cloud → your deployment → Integrations → OpenTelemetry
