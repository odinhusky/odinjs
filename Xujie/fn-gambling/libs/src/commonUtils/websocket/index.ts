import {
  useWebSocketStore,
  WebSocketMessage,
  WebSocketMessageType,
} from '@libs/mode2/zustand/webSocketStore';
import WebSocketCore from './core';
import { TWebSocketOnMessageResultType } from './type';
import HeartbeatWorker from './heartBeat/heartbeatWorker';

export default class WebSocketService {
  private static instance: WebSocketService | null = null;
  private wsCore: WebSocketCore;
  private heartbeatWorker: HeartbeatWorker | null = null;

  constructor(url: string) {
    this.wsCore = new WebSocketCore(url);

    // 监听网络状态变化
    this.addNetworkEventListeners();
  }

  private addNetworkEventListeners() {
    window.addEventListener('online', this.onNetworkOnline.bind(this));
    window.addEventListener('offline', this.onNetworkOffline.bind(this));
  }

  private removeNetworkEventListeners() {
    window.removeEventListener('online', this.onNetworkOnline.bind(this));
    window.removeEventListener('offline', this.onNetworkOffline.bind(this));
  }

  // 网络恢复时重新连接
  private onNetworkOnline() {
    console.log('[WebSocketService] 网络已恢复');
    this.connect();
  }

  // 网络断开时处理
  private onNetworkOffline() {
    console.warn('[WebSocketService] 网络已断开');
    useWebSocketStore.getState().setStatus('error');
    this.close();
  }

  static getInstance(url: string) {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService(url);
    }
    return WebSocketService.instance;
  }

  connect() {
    if (!navigator.onLine) {
      console.warn('[WebSocketService] 当前网络不可用，无法连接 WebSocket');
      useWebSocketStore.getState().setStatus('error');
      return;
    }

    this.wsCore.connect();

    // 設置連接成功後的回調
    this.wsCore.setOnConnectSuccessCallback(() => {
      // TODO delete test
      this.sendMessage({
        type: 'login',
        data: {
          message: `連接成功之後自動發送的第一條測試消息`,
        },
      });

      // 啟動心跳 - webworker
      if (!this.heartbeatWorker) {
        this.heartbeatWorker = new HeartbeatWorker(this.wsCore);
      }
      this.heartbeatWorker.start();
    });
  }

  sendMessage(message: WebSocketMessage) {
    // console.log(
    //   `[WebSocketService] 发送消息，当前 WebSocketCore 实例 ID: #${this.wsCore.getId()}`
    // );
    if (
      !this.wsCore ||
      this.wsCore.getWebSocketInstance()?.readyState !== WebSocket.OPEN
    ) {
      // this.messageQueue.addMessage(message);
    } else {
      this.wsCore.send(message);
    }
  }

  // 訂閱消息 - TODO 頻道區分 & 抽離 到 messageHandler & 取消訂閱
  subscribe(
    type: WebSocketMessageType,
    callback: (data: TWebSocketOnMessageResultType) => void
  ) {
    this.wsCore.setOnMessageCallback((data) => data.forEach(callback));
  }

  close() {
    this.heartbeatWorker?.stop();
    this.heartbeatWorker?.terminate();
    this.removeNetworkEventListeners();
    this.wsCore.close();
  }
}
