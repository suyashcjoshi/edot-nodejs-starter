import express from 'express';

const app = express();

app.use(express.static('public'));

app.get('/hello', (req, res) => {
  res.json({ ok: true });
});

app.get('/weather', async (req, res) => {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true';
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

app.get('/oops', (req, res) => {
  throw new Error('something went wrong');
});

app.listen(3000, () => console.log('hello-edot-node listening on http://localhost:3000'));
