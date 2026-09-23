const btnSend     = document.getElementById('btn-send');
const btnOutbound = document.getElementById('btn-outbound');
const btnLog      = document.getElementById('btn-log');
const btnStart    = document.getElementById('btn-start');
const btnStop     = document.getElementById('btn-stop');
const switchErrors = document.getElementById('switch-errors');
const rangeAuto   = document.getElementById('range-auto');
const rangeValue  = document.getElementById('range-value');
const inputLog    = document.getElementById('input-log');
const activityList = document.getElementById('activity-list');
const setupBanner  = document.getElementById('setup-banner');

const cntRequests = document.getElementById('cnt-requests');
const cntErrors   = document.getElementById('cnt-errors');
const cntStatus   = document.getElementById('cnt-status');
const cntLatency  = document.getElementById('cnt-latency');

let totalRequests = 0;
let totalErrors   = 0;
let autoTimer     = null;

const MIX = [
  { path: '/api/hello', weight: 6 },
  { path: '/api/slow',  weight: 4 },
];

function pickPath() {
  const total = MIX.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of MIX) {
    r -= item.weight;
    if (r <= 0) return item.path;
  }
  return MIX[0].path;
}

function pickMixed() {
  if (switchErrors.checked && Math.random() < 0.1) return '/api/error';
  return pickPath();
}

async function doRequest(path, method = 'GET', body = null, label = null) {
  const opts = { method };
  if (body !== null) {
    opts.headers = { 'Content-Type': 'application/json' };
    opts.body = JSON.stringify(body);
  }
  const t0 = Date.now();
  let status = 0;
  try {
    const res = await fetch(path, opts);
    status = res.status;
  } catch {
    status = 0;
  }
  const ms = Date.now() - t0;
  recordResult(method, path, status, ms, label);
}

function recordResult(method, path, status, ms, label = null) {
  totalRequests++;
  if (status === 0 || status >= 500) totalErrors++;

  cntRequests.textContent = totalRequests;
  cntErrors.textContent   = totalErrors;
  cntStatus.textContent   = status || 'ERR';
  cntLatency.textContent  = ms + ' ms';

  const li = document.createElement('li');
  if (status === 0 || status >= 500) li.classList.add('error');
  if (path === '/api/log') li.classList.add('log-entry');

  const labelHtml = label
    ? `<span class="col-label">${escapeHtml(label)}</span>`
    : '';

  li.innerHTML =
    `<span class="col-method">${method}</span>` +
    `<span class="col-path">${path}</span>` +
    labelHtml +
    `<span class="col-status">${status || 'ERR'}</span>` +
    `<span class="col-ms">${ms} ms</span>`;

  const empty = activityList.querySelector('.activity-empty');
  if (empty) empty.remove();

  activityList.insertBefore(li, activityList.firstChild);
  const items = activityList.querySelectorAll('li');
  if (items.length > 20) items[items.length - 1].remove();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function startAuto() {
  const rps = Number(rangeAuto.value);
  if (rps === 0) return;
  clearInterval(autoTimer);
  autoTimer = setInterval(() => doRequest(pickMixed()), Math.round(1000 / rps));
  btnStart.disabled = true;
  btnStop.disabled  = false;
}

function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
  btnStart.disabled = false;
  btnStop.disabled  = true;
}

btnSend.addEventListener('click', () => doRequest(pickMixed()));
btnOutbound.addEventListener('click', () => doRequest('/api/chain'));

btnLog.addEventListener('click', () => {
  const msg = inputLog.value.trim();
  if (!msg) return;
  doRequest('/api/log', 'POST', { message: msg }, `"${msg}"`);
  inputLog.value = '';
});

inputLog.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnLog.click();
});

rangeAuto.addEventListener('input', () => {
  rangeValue.textContent = rangeAuto.value;
  if (autoTimer) startAuto();
});

btnStart.addEventListener('click', startAuto);
btnStop.addEventListener('click', stopAuto);

// Check EDOT configuration on load
fetch('/api/status')
  .then(r => r.json())
  .then(({ configured, serviceName }) => {
    if (!configured) {
      setupBanner.classList.remove('hidden');
    }
    if (serviceName) {
      document.querySelector('header p').textContent =
        `Service: ${serviceName} — generate traffic and see traces, metrics, logs and errors in Elastic Observability.`;
    }
  })
  .catch(() => {});
