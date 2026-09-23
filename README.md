# Hello EDOT Node.js SDK Tutorial

The smallest possible Node.js app showing how to add **Elastic observability in one flag** — no code changes required.

## What is EDOT?

**EDOT** (Elastic Distribution of OpenTelemetry) is Elastic's open source distribution of the OpenTelemetry SDK.]([https://opentelemetry.io/](https://www.elastic.co/docs/reference/opentelemetry/edot-sdks)) It wraps the upstream OTel Node.js SDK with zero custom APIs so your app stays 100% OpenTelemetry compatible and you get traces, metrics and logs flowing to Elastic out of the box without any code changes.

**Benefits at a glance:**
- **Zero code changes** : Auto instrument any Node.js app with a single `--import` flag
- **Open source**: Built on OpenTelemetry so there is no vendor lock in
- **Free with Elastic Serverless**: [Elastic Cloud Serverless](https://www.elastic.co/cloud/serverless)
- **Auto-instrumentation**: Express, HTTP, fetch, databases and dependencies etc are detected automatically.


## Demo App Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Your Machine                         │
│                                                             │
│   curl /hello  ──►  Express App (app.js)                    │
│                           │                                 │
│                    EDOT Node.js SDK                         │
│              (@elastic/opentelemetry-node)                  │
│              auto-instruments HTTP + Express                │
│                           │                                 │
│              OTLP Collector (traces / metrics / logs)                 │
└───────────────────────────┼─────────────────────────────────┘
                            │  HTTPS
                            ▼
              ┌─────────────────────────┐
              │   Elastic Observability │
              │                         │
              │  • Distributed Traces   │
              │  • Service Map          │
              │  • Logs correlation     |
              │  • More ...             |
              └─────────────────────────┘
```


## Run the app (without EDOT)

```bash
npm install
npm start
```

Open `http://localhost:3000/hello` in your browser or:

```bash
curl http://localhost:3000/hello
```

## Connect to Elastic to see instant Observability

### 1. Install EDOT Node.js SDK

```bash
npm install @elastic/opentelemetry-node
```

### 2. Set your connection details

Get these values from your Elastic Application Integration (OTEL) page:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://your-deployment.apm.us-east-1.aws.elastic.cloud"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=ApiKey your-api-key-here"
export OTEL_SERVICE_NAME="hello-edot-node"
export OTEL_RESOURCE_ATTRIBUTES="service.version=1.0.0,deployment.environment.name=dev"
```

Or put them in a `.env` file to avoid re-exporting each session.

### 3. Start with one flag

```bash
node --import @elastic/opentelemetry-node app.js
```

With a `.env` file:

```bash
node --env-file=.env --import @elastic/opentelemetry-node app.js
```

No changes to `app.js` needed.

---

## View your data in Elastic

1. Open [Kibana](https://www.elastic.co/kibana) and go to **Observability → APM**
2. Your service (`hello-edot-node`) appears automatically after the first request
3. Hit `curl http://localhost:3000/hello` a few times to generate traces
4. Explore the **Service Map**, **Transactions**, and **Logs** tabs

---

## Resources

- [EDOT Node.js on GitHub](https://github.com/elastic/elastic-otel-node)
- [EDOT Node.js on npm](https://www.npmjs.com/package/@elastic/opentelemetry-node)
- [Elastic Cloud Serverless — free APM](https://www.elastic.co/cloud/serverless)
- [OpenTelemetry Node.js](https://opentelemetry.io/docs/languages/js/)
