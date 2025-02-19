import { create } from 'zustand';

export interface Message {
  key?: string;
  content: string;
  type?: 'success' | 'info' | 'error' | 'warning' | 'loading';
  callback?: (id: string) => void;
}

interface MessageStore {
  message: Message;
  setMessage: (message: Message) => void;
  success: (message: Message | string) => void;
  info: (message: Message | string) => void;
  error: (message: Message | string) => void;
  warning: (message: Message | string) => void;
  clear: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  message: { key: '', content: '' } as Message,
  setMessage: (message: Message) =>
    set(() => ({
      message: message,
    })),
  success: (message: Message | string) =>
    set(() => {
      const content = typeof message === 'string' ? message : message.content;
      return {
        message: {
          content: content,
          type: 'success',
        },
      };
    }),
  info: (message: Message | string) =>
    set(() => {
      const content = typeof message === 'string' ? message : message.content;
      return {
        message: {
          content: content,
          type: 'info',
        },
      };
    }),
  error: (message: Message | string) =>
    set(() => {
      const content = typeof message === 'string' ? message : message.content;
      return {
        message: {
          content: content,
          type: 'error',
        },
      };
    }),
  warning: (message: Message | string) =>
    set(() => {
      const content = typeof message === 'string' ? message : message.content;
      return {
        message: {
          content: content,
          type: 'warning',
        },
      };
    }),
  clear: () =>
    set(() => ({
      message: { key: '', content: '' },
    })),
}));
