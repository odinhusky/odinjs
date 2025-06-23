import sdkUtils from '@libs/mode2/utils/sdk';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import {
  useWebSocketStore,
  WebSocketMessage,
  WebSocketMessageType,
  WebSocketStatus,
} from '@libs/mode2/zustand/webSocketStore';
import { TWebSocketOnMessageResultType } from './type';
import { transformWebSocketResponse } from './utils';

export default class WebSocketCore {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectAttempts = 0; // 重连尝试次数
  private maxReconnectAttempts = 9; // 最大重连尝试次数
  private onConnectSuccessCallback?: () => void; // 連接成功回调
  private onMessageCallback?: (
    message: TWebSocketOnMessageResultType[],
    type: WebSocketMessageType
  ) => void; // 消息回调

  private readonly id: number;
  private static instanceCount = 0;
  private isManuallyClosed = false; // 标志是否是手动关闭

  constructor(url: string) {
    this.url = url;

    // 用于调试 跟踪实例数量
    this.id = WebSocketCore.instanceCount++;
    // console.log(`[WebSocketCore] 创建 WebSocketCore 实例 ${this.id}`);
  }

  // 连接 WebSocket
  connect() {
    this.setStatus('connecting');
    const deviceId = sdkUtils.getDeviceID();
    const playerId = useUserProfileStore.getState().id;
    // console.log('[WebSocketCore] 连接 WebSocket', this.id, deviceId, playerId);
    // if (
    //   this.ws &&
    //   (this.ws.readyState === WebSocket.CONNECTING ||
    //     this.ws.readyState === WebSocket.OPEN)
    // ) {
    //   console.log('[WebSocketCore] 已连接或正在连接');
    //   return;
    // }

    const url = this.url + `?deviceId=${deviceId}&playerId=${playerId}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);

    // console.log('[WebSocketCore] WebSocket 实例:', this.ws, this.id);
  }

  private onOpen() {
    console.log('[WebSocketCore] 连接成功');
    this.setStatus('open');
    this.reconnectAttempts = 0;
    this.isManuallyClosed = false;

    // 通知外部连接已成功
    if (this.onConnectSuccessCallback) {
      this.onConnectSuccessCallback();
    }
  }

  private onMessage(event: MessageEvent) {
    // console.log('[WebSocketCore] 收到消息:', event.data);
    try {
      const parsedData = JSON.parse(event.data);
      if (this.onMessageCallback) {
        const data = transformWebSocketResponse(
          parsedData,
          event.type as WebSocketMessageType
        ); // 转换为统一格式
        if (data) {
          this.onMessageCallback(data, event.type as WebSocketMessageType); // 调用外部订阅的回调
        }
      }
    } catch (error) {
      console.warn('[WebSocketCore] 消息解析失败:', error, event.data);
    }
  }

  private onClose() {
    console.log('[WebSocketCore] 连接关闭');
    this.ws = null;
    this.setStatus('closed');
    this.reconnect();
  }

  private onError(err: Event) {
    console.error('[WebSocketCore] 发生错误:', err);
    this.setStatus('error');
  }

  // 指数回退策略重连
  private reconnect() {
    if (this.isManuallyClosed) {
      console.warn('[WebSocketCore] 手动关闭标志已设置，不再重连');
      return;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WebSocketCore] 已达到最大重连尝试次数，不再重连');
      return;
    }
    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    console.log(`[WebSocketCore] ${delay / 1000}s 后尝试重连`);
    setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // 更新zustand狀態
  private setStatus(status: WebSocketStatus) {
    useWebSocketStore.getState().setStatus(status);
  }

  close() {
    if (this.ws) {
      console.log('[WebSocketCore] 关闭连接');
      this.isManuallyClosed = true; // 设置手动关闭标志
      this.ws.close();
      this.ws = null;
      this.setStatus('closed');
    }
  }

  send(message: WebSocketMessage) {
    // console.log('[WebSocketCore] 发送消息:', message, this.id);
    const status = useWebSocketStore.getState().status;
    if (status === 'open' && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('[WebSocketCore] 连接未建立，无法发送消息');
    }
  }

  getWebSocketInstance(): WebSocket | null {
    // console.log('[WebSocketCore] 获取 WebSocket 实例', this.ws, this.id);

    // if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
    //   console.warn('[WebSocketCore] WebSocket 连接未建立，稍后再试');
    //   // this.connect();
    //   return null;
    // }
    return this.ws;
  }

  // 设置外部的连接成功回调
  setOnConnectSuccessCallback(callback: () => void) {
    this.onConnectSuccessCallback = callback;
  }

  // 设置外部的消息回调
  setOnMessageCallback(
    callback: (
      data: TWebSocketOnMessageResultType[],
      type: WebSocketMessageType
    ) => void
  ) {
    this.onMessageCallback = callback;
  }

  getId() {
    return this.id;
  }
}
