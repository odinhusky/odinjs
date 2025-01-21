import { useAppStore } from '@mode2/zustand/appStore';
import sdkUtils from '@mode2/utils/sdk';
import { usePostBindPushTokenMutation } from '@mode2API/index';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

export const useBindNotifyPushToken = () => {
  const appStore = useAppStore.getState();
  const [postBindPushToken, { data }] = usePostBindPushTokenMutation();

  useEffect(() => {
    if (data === true) {
      appStore.setUpdatePushToken(true);
    }
  }, [data]);

  const doBindToken = () => {
    if (!appStore.isUpdatePushToken) return;
    if (!sdkUtils.isCurrentLogin()) return;
    const pushToken = useAppStore.getState().pushToken;
    if (isEmpty(pushToken)) return;
    postBindPushToken({ token: pushToken });
  };

  return {
    doBindToken,
  };
};
