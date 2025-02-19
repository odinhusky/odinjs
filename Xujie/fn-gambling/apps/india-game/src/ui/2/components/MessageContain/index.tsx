import {
  Message,
  useMessageStore,
} from '@mode2/zustand/components/messageStore';
import { useState } from 'react';
import useUpdateEffect from '@commonUtils/hooks/useUpdateEffect';
import { message as antdMessage } from 'antd';
import { v4 as uuidv4 } from 'uuid';

export const MessageContain = () => {
  // maxCount: 3， 最多顯示三則訊息
  const [messageApi, contextHolder] = antdMessage.useMessage({ maxCount: 3 });
  const message = useMessageStore((state) => state.message);
  const clear = useMessageStore((state) => state.clear);

  const [messageState, setMessageState] = useState<Message | null>(null);

  useUpdateEffect(() => {
    if (message.content) {
      setMessageState({ ...message, key: uuidv4() });
    } else {
      setMessageState(null);
    }
  }, [message]);

  useUpdateEffect(() => {
    if (messageState) {
      messageApi.open({
        key: messageState.key,
        type: messageState.type || 'error',
        content: messageState.content,
        onClose: () => {
          messageState.callback?.(messageState.key || '');
        },
        onClick: () => {
          // 被點擊就清除
          setTimeout(() => {
            messageApi.destroy(messageState.key);
            clear();
          }, 500);
        },
      });
    }
  }, [messageState]);

  return <> {contextHolder} </>;
};

export default MessageContain;
