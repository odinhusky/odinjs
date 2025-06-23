let timer: NodeJS.Timeout | null = null;

self.onmessage = (event: MessageEvent) => {
  console.log('[WebSocketHeartbeatWorker] heartbeat.worker.ts', event);
  const { type, interval, message } = event.data;

  switch (type) {
    case 'start':
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        self.postMessage({ type: 'ping', message });
      }, interval);
      break;

    case 'update':
      if (timer) {
        clearInterval(timer);
        timer = setInterval(() => {
          self.postMessage({ type: 'ping', message });
        }, interval);
      }
      break;

    case 'stop':
      if (timer) clearInterval(timer);
      timer = null;
      break;
  }
};

export {}; // 標記此為 module，避免 TS 錯誤
