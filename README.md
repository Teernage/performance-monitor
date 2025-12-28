# Performance SDK

一个轻量的前端性能监控 SDK，开箱即用地采集核心性能指标（Core Web Vitals、资源与网络、交互与长任务、视觉稳定性），并通过 `sendBeacon`（或 `fetch keepalive` 兜底）稳定上报到你的服务端。

- 包名：`performance-sdk`
- 产物：`dist/index.cjs.js`、`dist/index.esm.js`、`dist/index.umd.js`
- 许可证：MIT

## 目录结构

```bash
performance-monitor/
├── dist/                 # 打包产物
├── src/                  # 源码目录
│   ├── index.ts          # 入口文件
│   ├── loading/          # 加载与绘制采集（FP/FCP/LCP/Load）
│   ├── interaction/      # 交互采集（FID/INP/LongTask）
│   ├── visualStability/  # 视觉稳定性（CLS）
│   ├── network/          # 资源与请求（ResourceTiming / API 请求）
│   ├── report/           # 数据上报（sendBeacon / fetch keepalive）
│   └── util/             # 工具与路由监听（getSelector/onUrlChange）
├── test/                 # 测试靶场
│   ├── server.js         # 本地测试服务
│   ├── index.html        # 指标触发页面
│   └── case-*.js         # 专项示例（cls/interaction/longtask/network）
├── package.json          # 项目配置
├── rollup.config.js      # Rollup 打包配置
└── tsconfig.json         # TypeScript 配置
```

## 功能概览

- 页面加载与渲染：`FP`、`FCP`、`LCP`、`load/pageshow`
- 交互性能：`FID`、`INP`（事件级交互耗时，含输入延迟/处理/呈现）
- 长任务监控：`LongTask`（阻塞主线程）
- 视觉稳定性：`CLS`（累积布局偏移，含来源元素选择器）
- 资源与网络：`PerformanceResourceTiming`（DNS/TCP/TTFB/大小/协议）
- 稳定上报：优先 `navigator.sendBeacon`，降级 `fetch keepalive`

## 快速开始

npm install

npm run build （生成 dist 产物文件，可直接引入使用）

### 1) 使用 UMD（无打包器）

```html
<script src="/dist/index.umd.js"></script>
<script>
  // UMD 全局名：window.PerformanceSDK
  const PerformanceMonitor = window.PerformanceSDK;
  const monitor = new PerformanceMonitor({
    reportUrl: '/api/performance',
    log: true, // 开发环境建议开启；生产关闭
  });
  monitor.init();
</script>
```

### 2) 使用 ESModule 或 CJS（配合打包器）

```ts
// ESM
import PerformanceMonitor from './dist/index.esm.js';

const monitor = new PerformanceMonitor({
  reportUrl: '/api/performance',
  log: false,
});
monitor.init();
```

```js
// CJS
const PerformanceMonitor = require('./dist/index.cjs.js');

const monitor = new PerformanceMonitor({
  reportUrl: '/api/performance',
  log: false,
});
monitor.init();
```

## 配置项

```ts
new PerformanceMonitor({
  // 是否在控制台输出调试日志（CLS 源等）
  log: true, // 默认 true

  // 数据上报地址
  reportUrl: '/api/performance', // 默认 /api/performance
});
```

## 指标说明与上报数据

SDK 所有上报都会自动追加公共字段：
`userAgent`、`timestamp`。以下为主要指标结构（示例）：

- 渲染类（`FP`、`FCP`、`LCP`）
  - 共同字段：`type: 'performance'`、`name`、`startTime`、`pageUrl`
  - `LCP` 额外：`lcpTime`（= `startTime`）、`elementSelector`

```json
{
  "type": "performance",
  "name": "first-contentful-paint",
  "startTime": 123.45,
  "pageUrl": "https://example.com",
  "userAgent": "...",
  "timestamp": 1735380000000
}
```

- 交互类（`FID`）
  - `inputDelay = processingStart - startTime`
  - `elementSelector`（触发元素选择器）

```json
{
  "type": "performance",
  "subType": "first-input",
  "name": "click",
  "startTime": 200.12,
  "duration": 45.67,
  "inputDelay": 18.3,
  "elementSelector": "button#submit.primary",
  "pageUrl": "https://example.com"
}
```

- 事件级交互（`INP`）
  - 采集 `event` entry：`duration`、`inputDelay`、`processingTime`、`presentationDelay`、`interactionId`
  - 默认只记录较慢交互：`durationThreshold: 40ms`

```json
{
  "type": "performance",
  "subType": "interaction",
  "name": "click",
  "duration": 85.3,
  "startTime": 300.1,
  "processingStart": 315.0,
  "processingEnd": 360.0,
  "inputDelay": 14.9,
  "processingTime": 45.0,
  "presentationDelay": 25.3,
  "interactionId": 123456789,
  "pageUrl": "https://example.com"
}
```

- 长任务（`LongTask`）
  - `duration`、`startTime`，并尝试提供 `attribution`（来源）

```json
{
  "type": "performance",
  "subType": "longtask",
  "name": "LongTask",
  "duration": 100.0,
  "attribution": [{ "来源": "longTaskFrame", "类型": "window" }],
  "startTime": 400.5,
  "pageUrl": "https://example.com"
}
```

- 资源与网络（`resource`）
  - `dns`、`tcp`、`ttfb`、`transferSize`、`encodedBodySize`、`decodedBodySize`、`nextHopProtocol` 等

```json
{
  "type": "performance",
  "subType": "resource",
  "sourceType": "fetch",
  "name": "https://api.example.com/data",
  "duration": 120.3,
  "dns": 10.1,
  "tcp": 20.2,
  "ttfb": 50.0,
  "transferSize": 15234,
  "responseBodySize": 14000,
  "responseHeaderSize": 1234,
  "resourceSize": 22000,
  "protocol": "h2",
  "startTime": 500.0,
  "pageUrl": "https://example.com"
}
```

提示：

- 为避免上报循环，SDK 会过滤上报接口本身的请求（`name.includes(reportUrl)`）。
- 跨域资源如需完整 `ResourceTiming` 细节，请在响应头设置 `Timing-Allow-Origin: *`（或指定来源）。

## 路由与 CLS

- `CLS` 会在页面隐藏（`visibilitychange`/`pagehide`）或 SPA 路由切换时上报并重置。
- SDK 内置对 `history.pushState/replaceState` 与 `popstate` 的拦截，用于检测路由变化。

## 服务端示例（Node/Express）

测试目录已提供完整示例：

```js
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ type: ['application/json', 'text/plain'] }));

app.post('/api/performance', (req, res) => {
  console.log('Received performance data:', JSON.stringify(req.body, null, 2));
  res.status(200).send({ success: true });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

## 本地开发与演示

```bash
# 安装依赖
npm install

# 构建产物到 dist/
npm run build

# 启动演示服务器
node test/server.js

# 打开演示页
open http://localhost:3000/test/index.html
```

测试页包含交互、长任务、网络请求、CLS 触发按钮，便于你观察各类上报。

## 兼容性与降级

- 依赖 `PerformanceObserver` 的各 EntryType：
  - `paint`（FP/FCP）、`largest-contentful-paint`、`first-input`、`resource`、`longtask`、`layout-shift`、`event`（INP）
- 若浏览器不支持某类型（例如较旧版本不支持 `event`），对应采集函数会安全地不执行。
- 上报优先 `navigator.sendBeacon`，不支持时自动降级到 `fetch` 并开启 `keepalive`。

## 最佳实践

- 生产环境关闭 `log` 避免控制台噪声与性能影响
- 为跨域资源开启 `Timing-Allow-Origin`
- 对高频交互可调高阈值（当前 `INP` 使用 40ms）以降低日志量
- 服务端存储时注意脱敏与隐私合规（SDK 默认不采集 PII）
