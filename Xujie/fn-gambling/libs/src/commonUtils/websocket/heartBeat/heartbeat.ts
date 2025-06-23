// import { WebSocketMessage } from '@libs/mode2/zustand/webSocketStore';
// import WebSocketCore from '../core';

// export default class Heartbeat {
//   private intervalId: NodeJS.Timeout | null = null;
//   private wsCore: WebSocketCore;
//   private pingMessage: WebSocketMessage;

//   constructor(
//     wsCore: WebSocketCore,
//     pingMessage: WebSocketMessage = {
//       type: 'ping',
//     }
//   ) {
//     this.wsCore = wsCore;
//     this.pingMessage = pingMessage;
//   }

//   start() {
//     if (this.intervalId) {
//       console.warn('[Heartbeat] 心跳已在运行');
//       return;
//     }

//     this.intervalId = setInterval(() => {
//       try {
//         this.wsCore.send(this.pingMessage);
//         console.log('[Heartbeat] 发送心跳');
//       } catch (error) {
//         console.error('[Heartbeat] 发送心跳失败:', error);
//         this.stop();
//       }
//     }, 5000);

//     console.log('[Heartbeat] 开始心跳');
//   }

//   // 处理收到的心跳响应
//   handleResponse() {
//     console.log('[Heartbeat] 收到心跳响应');
//   }

//   stop() {
//     if (this.intervalId) {
//       clearInterval(this.intervalId);
//       this.intervalId = null;
//       console.log('[Heartbeat] 停止心跳');
//     }
//   }
// }
