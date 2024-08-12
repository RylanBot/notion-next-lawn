const logCache = new Map();
const cacheDuration = 5000;

async function sendLogToServer(log) {
  const now = Date.now();
  const key = JSON.stringify({ url: log.url, message: log.message });
  if (logCache.has(key)) return;

  logCache.set(key, { timestamp: now });

  // 发送日志到服务器
  await fetch('/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(log)
  });
}

setInterval(() => {
  const now = Date.now();
  for (const [key, { timestamp }] of logCache) {
    if (now - timestamp >= cacheDuration) {
      logCache.delete(key);
    }
  }
}, cacheDuration);

export function initLogging() {
  // 捕捉全局错误
  window.onerror = function (message, source, lineno, colno, error) {
    sendLogToServer({
      url: window.location.href,
      message,
      source, // 发生错误的源文件
      lineno,
      colno,
      stack: error?.stack
    });
  };

  // 捕捉 Promise 拒绝错误
  window.addEventListener('unhandledrejection', function (event) {
    sendLogToServer({
      url: window.location.href,
      message: event.reason?.message || 'Unhandled rejection',
      stack: event.reason?.stack
    });
  });

  // 重写 console.error 方法
  const originalConsoleError = console.error;
  console.error = function (...args) {
    originalConsoleError.apply(console, args);
    sendLogToServer({
      url: window.location.href,
      message: args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ')
    });
  };
}
