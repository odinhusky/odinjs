import { useEffect } from 'react';
import { IActivityMessage } from './types';

export const useActivityCenterMessage = ({
  onReceive,
}: {
  onReceive: (data: IActivityMessage) => void;
}) => {
  const params = new URLSearchParams(window.location.search);
  const targetOrigin = params.get('origin') || '';
  useEffect(() => {
    // 监听来自页面的消息
    window.addEventListener('message', receiveMessage, false);

    return () => {
      // 清理事件监听器
      window.removeEventListener('message', receiveMessage, false);
    };
  }, []);

  const sendMessage = (data: IActivityMessage) => {
    const message = JSON.stringify(data);
    targetOrigin && window.top?.postMessage(message, targetOrigin);
  };

  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== targetOrigin) return;
    onReceive(JSON.parse(event.data));
  };
  return {
    sendMessage,
  };
};

export const useGameAppMessage = ({
  targetOrigin,
  iframeRef,
  onReceive,
}: {
  targetOrigin: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onReceive: (data: IActivityMessage) => void;
}) => {
  useEffect(() => {
    // 监听来自活动中心的消息
    window.addEventListener('message', receiveMessage, false);
    return () => {
      // 清理事件监听器
      window.removeEventListener('message', receiveMessage, false);
    };
  }, []);

  const sendMessage = (data: IActivityMessage) => {
    const message = JSON.stringify(data);

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, targetOrigin);
    }
  };

  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== targetOrigin) return;
    onReceive(JSON.parse(event.data));
  };
  return {
    sendMessage,
  };
};
