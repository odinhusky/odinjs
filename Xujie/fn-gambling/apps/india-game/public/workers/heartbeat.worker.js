// import '@libs/commonUtils/websocket/heartBeat/heartbeat.worker';

let timer = null;

self.onmessage = (event) => {
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

// export {}; // 標記此為 module，避免 TS 錯誤
