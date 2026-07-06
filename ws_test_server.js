// Simple WebSocket test server for ARSandbox client
// Usage: npm install ws && node ws_test_server.js
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const wss = new WebSocket.Server({ port: 8282 }, () => console.log('WS test server listening on ws://localhost:8282'));

// load sample PNG (small 32x32) - if not present, create a tiny red PNG buffer programmatically
const samplePath = path.join(__dirname, 'sample32.png');
let pngData;
if (fs.existsSync(samplePath)) {
  pngData = fs.readFileSync(samplePath).toString('base64');
} else {
  // pre-encoded 32x32 red PNG (very small) as base64 to avoid image generation dependencies
  // 1x1 red PNG, repeated scaled in client isn't necessary; we just send a tiny PNG that loads.
  pngData = 'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAK1JREFUeNpi/P//PwMlgImBQkAAiWQwMDAw8mBgYGBgYGBgYGNgYGBgYGJgYGBgYGJgYGBgYGKQYGBgYGBgYGBgZGJgYGBgYGBgYGJhYGBgYGBgYGBgYGBlYQkADAKrXC7j2H6zQAAAAAElFTkSuQmCC';
}

wss.on('connection', ws => {
  console.log('client connected');
  ws.send(JSON.stringify({ info: 'welcome', time: new Date().toISOString() }));
  const iv = setInterval(() => {
    const msg = { png: 'data:image/png;base64,' + pngData, time: new Date().toISOString() };
    ws.send(JSON.stringify(msg));
  }, 2000);
  ws.on('close', () => { console.log('client disconnected'); clearInterval(iv); });
});

wss.on('error', e => console.error('WSS error', e));
