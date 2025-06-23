import { useAppStore } from '@mode2/zustand/appStore';
import sdkUtils from '@mode2/utils/sdk';
import { usePostBindPushTokenMutation } from '@mode2API/index';
import isEmpty from 'lodash/isEmpty';

/**
 * @author Evan
 * @date 2025-03-12
 * @optimization
 * 降低渲染次數，useAppStore.getState()，改為即時獲取
 *
 */
export const useBindNotifyPushToken = () => {
  // const appStore = useAppStore.getState();
  const [postBindPushToken] = usePostBindPushTokenMutation();

  const doBindToken = () => {
    if (useAppStore.getState().isUpdatePushToken) return;
    if (!sdkUtils.isCurrentLogin()) return;
    const pushToken = useAppStore.getState().pushToken;
    if (isEmpty(pushToken)) return;

    postBindPushToken({ token: pushToken })
      .unwrap()
      .then((resp) => {
        if (resp) {
          useAppStore.getState().setUpdatePushToken(true);
        }
      })
      .catch((error) => {
        console.log('@@@===>error', error);
      });
  };

  return {
    doBindToken,
  };
};
