import { useMessageStore } from '@mode2/zustand/components/messageStore';
import useUpdateEffect from '@commonUtils/hooks/useUpdateEffect';
import { v4 as uuidv4 } from 'uuid';
import { useToastStore } from '@mode2/zustand/components/toastStore';

export const MessageContain = () => {
  // maxCount: 3， 最多顯示三則訊息
  // const [messageApi, contextHolder] = antdMessage.useMessage({ maxCount: 3 });
  const showToast = useToastStore((state) => state.showToast);
  const message = useMessageStore((state) => state.message);
  // const clear = useMessageStore((state) => state.clear);

  useUpdateEffect(() => {
    if (message.content) {
      const uuid = uuidv4();
      showToast(
        message.content,
        (id) => {
          // if (id === uuid) {
          //   clear();
          // }
        },
        uuid
      );
      // setMessageState({ ...message, key: uuidv4() });
    } else {
      // setMessageState(null);
    }
  }, [message]);

  // useUpdateEffect(() => {
  //   if (messageState) {
  //     showToast(
  //       messageState.content,
  //       (id) => {
  //         // clear();
  //       },
  //       messageState.key
  //     );
  //
  //   }
  // }, [messageState]);

  return <></>;
  // return <> {contextHolder} </>;
};

export default MessageContain;
