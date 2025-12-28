import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());
// Parse JSON and text bodies
app.use(express.json({ type: ['application/json', 'text/plain'] }));

// Serve static files from 'test' and 'dist' directories
app.use('/test', express.static(path.join(__dirname)));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// API: Mock delay to test TTFB
app.get('/api/delay/:ms', (req, res) => {
  const ms = parseInt(req.params.ms) || 0;
  setTimeout(() => {
    res.json({
      message: `Response delayed by ${ms}ms`,
      ttfb_expected: ms,
      timestamp: Date.now(),
    });
  }, ms);
});

// API: Standard response with Timing-Allow-Origin header
app.get('/api/timing', (req, res) => {
  res.set('Timing-Allow-Origin', '*');
  res.json({ message: 'This response has Timing-Allow-Origin header' });
});

// API: Receive performance data
app.post('/api/performance', (req, res) => {
  const data = req.body;
  console.log('Received performance data:', JSON.stringify(data, null, 2));
  res.status(200).send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test page: http://localhost:${PORT}/test/index.html`);
});
