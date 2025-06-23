import WebSocketCore from '../core';

export default class HeartbeatWorker {
  private worker: Worker | null = null;
  private wsCore: WebSocketCore;

  constructor(wsCore: WebSocketCore) {
    this.wsCore = wsCore;
  }

  start() {
    // 检查 wsCore 是否已初始化
    if (!this.wsCore.getWebSocketInstance()) {
      console.error(
        '[WebSocketHeartbeatWorker] WebSocket instance is not initialized'
      );
      return;
    }

    // const url = new URL('@/workers/heartbeat.worker.ts', import.meta.url); // 本地開發
    const url = new URL('/workers/heartbeat.worker.js', import.meta.url);
    console.log(`[WebSocketHeartbeatWorker] url: ${url}`);
    this.worker = new Worker(url /**  , { type: 'module' }   */);

    this.worker.onmessage = (e) => {
      if (e.data.type === 'ping') {
        if (this.wsCore.getWebSocketInstance()?.readyState === WebSocket.OPEN) {
          this.wsCore.send(e.data.message);
        } else {
          console.warn(
            '[WebSocketHeartbeatWorker] WebwsCore not open, skipping ping'
          );
        }
      }
    };

    this.worker.onerror = (err) => {
      console.error('[WebSocketHeartbeatWorker] Error:', err);
    };

    if (this.worker) {
      this.worker.postMessage({
        type: 'start',
        interval: 10000,
        message: {
          type: 'ping',
        },
      });
      console.log('[WebSocketHeartbeatWorker] Worker started');
    }
  }

  stop() {
    this.worker?.postMessage({ type: 'stop' });
  }

  terminate() {
    this.worker?.terminate();
  }
}
