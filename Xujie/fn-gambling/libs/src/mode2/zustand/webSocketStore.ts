import { create } from 'zustand';

export type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';
export type WebSocketMessageType =
  | 'chat'
  | 'ping'
  | 'message'
  | 'pong'
  | 'login'
  | 'system';

export type WebSocketMessage = {
  type: WebSocketMessageType;
  data?: {
    message: string;
  };
};

interface WebSocketState {
  status: WebSocketStatus;
  setStatus: (status: WebSocketStatus) => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  status: 'connecting',
  setStatus: (status: WebSocketStatus) => set({ status }),
}));
