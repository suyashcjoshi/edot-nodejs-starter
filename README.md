# EDOT Node.js Starter

[![Node >= 20.6](https://img.shields.io/badge/node-%3E%3D20.6-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Observed with Elastic EDOT](https://img.shields.io/badge/Observed%20with-Elastic%20EDOT-00BFB3?style=for-the-badge&logo=elastic&logoColor=white)](https://www.elastic.co/docs/reference/opentelemetry/edot-sdks/node/setup)
[![License Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-lightgrey?style=for-the-badge)](LICENSE)

The smallest Node.js app that shows how to get traces, metrics, logs and errors into
Elastic Observability with one flag and no code changes.

The home page is a small traffic generator. Click a button, flip a switch, move a slider,
and watch the data appear in Kibana.

## How it works

```
Browser  -->  Express app (app.js) with dummy OTEL data (logs, metrics, traces)
                  |
                  |  started with: node --import @elastic/opentelemetry-node app.js
                  |  the SDK sends traces, metrics and logs over OTLP (HTTPS)
                  v
              OTEL Observability in Elastic (Kibana)
```

The SDK loads before your code and instruments Express, HTTP and pino on its own. 

## Run the app

```bash
git clone https://github.com/suyashcjoshi/edot-nodejs-starter && cd edot-nodejs-starter
npm install
npm start
```

Open http://localhost:3000. Nothing is connected to Elastic yet.

## Connect to Elastic

Don't have Elastic yet? Start a [free trial](https://cloud.elastic.co) and choose Serverless --> Observability Project.

### 1. Install the SDK

```bash
npm install @elastic/opentelemetry-node
```

### 2. Get your endpoint and API key

In your Elastic project open **Add data**, then **Application**, then **OpenTelemetry**. Give your Service a name and then copy the values from Elastic UI into your shell:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://<your-project>.ingest.<region>.elastic.cloud:443"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=ApiKey <your-api-key>"
export OTEL_SERVICE_NAME="edot-nodejs-starter"
export OTEL_RESOURCE_ATTRIBUTES="service.version=1.0.0,deployment.environment.name=dev"
export ELASTIC_OTEL_NODE_ENABLE_LOG_SENDING=true
```

Tip: You can update `.env.example` to `.env` and fill in the values.

### 3. Start Node.js app with one flag

```bash
node --import @elastic/opentelemetry-node app.js
```

If using `.env` file start using following command:

```bash
npm run start:edot
```

### 4. Generate some traffic

Open http://localhost:3000, click **Send request** a few times, turn on **Include errors**,
set **Auto traffic** to 5, and write a log message.

### 5. Look in Kibana

Go to **Observability**, then **Services**. `edot-nodejs-starter` appears after a minute or two.

## What the variables do

| Variable | What it does |
|---|---|
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Where the data goes. Your project's ingest URL. |
| `OTEL_EXPORTER_OTLP_HEADERS` | Proves it is you. Carries the API key. |
| `OTEL_SERVICE_NAME` | The name Kibana shows. Without it you get `unknown_service:node`. |
| `OTEL_RESOURCE_ATTRIBUTES` | Optional labels on all data, such as version and environment. |
| `ELASTIC_OTEL_NODE_ENABLE_LOG_SENDING` | Sends pino logs to Elastic. Off by default. |

## What each control shows you

| On the page | What it calls | Where to look in Kibana |
|---|---|---|
| Send request | `/api/hello` and `/api/slow` | Transactions, latency distribution |
| Include errors | adds `/api/error` | Errors tab, failed transaction rate |
| Auto traffic slider | the same mix on a timer | Throughput, and CPU, memory and event loop on the Metrics tab |
| Write log | `POST /api/log` | Logs, correlated to the transaction by trace id |
| Chained request | `/api/chain` calls `/api/hello` | A trace with an outbound HTTP span inside |

`console.log` is not collected. Logs come from pino.

## Learn more

- EDOT Node.js setup: https://www.elastic.co/docs/reference/opentelemetry/edot-sdks/node/setup
- EDOT Node.js on GitHub: https://github.com/elastic/elastic-otel-node
- Full story with a realistic app: https://github.com/suyashcjoshi/elastic-observability-nodejs-demo

## License

Apache-2.0. Elastic and Kibana are trademarks of Elasticsearch B.V. This is a personal
demo repository.
