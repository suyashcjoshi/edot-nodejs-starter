import express from 'express';
import pino from 'pino';

const log = pino();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    log.info({ method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start }, 'request');
  });
  next();
});

app.get('/api/hello', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/slow', (req, res) => {
  const ms = 300 + Math.floor(Math.random() * 600);
  setTimeout(() => res.json({ ok: true, ms }), ms);
});

app.get('/api/error', (req, res) => {
  throw new Error('something went wrong');
});

app.get('/api/chain', async (req, res) => {
  const response = await fetch(`http://localhost:${PORT}/api/hello`);
  const data = await response.json();
  res.json(data);
});

app.post('/api/log', (req, res) => {
  const { message } = req.body;
  if (message) log.info({ message }, 'user log');
  res.json({ ok: true });
});

app.get('/api/status', (req, res) => {
  const configured = !!(
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT &&
    process.env.OTEL_EXPORTER_OTLP_HEADERS
  );
  res.json({
    configured,
    serviceName: process.env.OTEL_SERVICE_NAME || null,
    language: 'Node.js',
  });
});

app.listen(PORT, () => console.log(`edot-nodejs-demo listening on http://localhost:${PORT}`));
