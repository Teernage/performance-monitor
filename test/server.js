import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// 为所有路由启用 CORS
app.use(cors());
// 解析 JSON 与纯文本请求体
app.use(express.json({ type: ['application/json', 'text/plain'] }));

// 提供 'test' 与 'dist' 目录的静态资源
app.use('/test', express.static(path.join(__dirname)));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// API：模拟延迟用于测试 TTFB
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

// API：带 Timing-Allow-Origin 响应头的标准接口
app.get('/api/timing', (req, res) => {
  res.set('Timing-Allow-Origin', '*');
  res.json({ message: 'This response has Timing-Allow-Origin header' });
});

// API：接收性能数据
app.post('/api/performance', (req, res) => {
  const data = req.body;
  console.log('Received performance data:', JSON.stringify(data, null, 2));
  res.status(200).send({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Test page: http://localhost:${PORT}/test/index.html`);
});
