# edot-nodejs-in-one-flag

The smallest possible Node.js app — used to show how to connect to Elastic with a single `--import` flag, no code changes required.

## Run the app

```bash
npm install
npm start
```

Then try the three routes:

```bash
curl http://localhost:3000/hello
curl http://localhost:3000/weather
curl http://localhost:3000/oops
```

## Connect to Elastic

Install the EDOT Node.js SDK:

```bash
npm install @elastic/opentelemetry-node
```

Set your connection details:

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT="https://your-deployment.apm.us-east-1.aws.elastic.cloud"
export OTEL_EXPORTER_OTLP_HEADERS="Authorization=ApiKey your-api-key-here"
export OTEL_SERVICE_NAME="weather-demo"
export OTEL_RESOURCE_ATTRIBUTES="service.version=1.0.0,deployment.environment.name=dev"
```

Start the app with one flag — no code changes needed:

```bash
node --import @elastic/opentelemetry-node app.js
```

The same variables can live in a `.env` file and be loaded with `node --env-file=.env --import @elastic/opentelemetry-node app.js`.
