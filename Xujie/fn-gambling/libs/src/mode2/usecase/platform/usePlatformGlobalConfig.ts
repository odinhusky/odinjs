import { useAdjustEventToken } from '@mode2/usecase/platform/useAdjustEventToken';
import { useActiveUserEvent } from '@mode2/usecase/useActiveUserEvent';
import { useEffect } from 'react';
import sdkUtils from '@mode2/utils/sdk';
import isEmpty from 'lodash/isEmpty';
import { useAppStore } from '@mode2/zustand/appStore';
import useActivityAutoDisplay from '@mode2/usecase/activity/useActivityAutoDisplay';

/**
 * 這裡放平台相關全局設定
 * 在 TemplateLayout 使用，避免頁面刷新失去資料
 */
export const usePlatformGlobalConfig = () => {
  const { doActiveEventReport } = useActiveUserEvent();

  // Adjust 需要的事件 token
  useAdjustEventToken();

  // get OneSignal Id，try count 15
  useEffect(() => {
    sdkUtils.getPushToken(15, 500).then((resp) => {
      if (useAppStore.getState().pushToken) {
        return;
      }
      if (!isEmpty(resp)) {
        useAppStore.getState().setPushToken(resp);
      }
    });
  }, []);

  // 自動開啟活動中心
  useActivityAutoDisplay();

  useEffect(() => {
    doActiveEventReport();
  }, []);
};
