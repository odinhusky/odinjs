// buildTime?: number; // EventTypeBuild EventType = 0 // 打包
// firstInstallTime?: number; // EventTypeInstall EventType = 1 // 安装
// lastUpdateTime?: number; // EventTypeForceUpdateTime EventType = 4 // 强更时间
// firstLaunch?: number; // EventTypeLaunch EventType = 2 // 启动
// lastLaunch?: number;
// launchCount?: number;

import { usePostDeviceEventMutation } from '@mode2API/index';
import {
  AppDeviceEvent,
  DeviceEventResult,
} from '@mode2API/endpoint/event/PostDeviceEventEndpoint';
import sdkUtils from '@mode2/utils/sdk';
import dayjs from 'dayjs';
import { toUnixTimestamp } from '@libs/commonUtils';
import { useAppDeviceEventStore } from '@mode2/zustand/platform/appDeviceEventStore';
import { useEffect } from 'react';
import { appEventFlagStore } from '@mode2/localforage/stroe';
import { useAppStore } from '@mode2/zustand/appStore';
import {
  PostHogEventPayload,
  PostHogPayloadType,
} from '@mode2/utils/sdk/strategy/analytics/PostHogAnalytics';

// export enum AppDeviceEvent {
//   BUILD = 0, // 打包
//   INSTALL = 1, // 安装
//   LAST_UPDATE = 4, // 更新
//   LAUNCH = 2, // 啟動
//   LOGIN = 3, // 登入
// }

const Key = {
  APP_BUILD_TIME: 'appBuildTime',
  APP_INSTALL_TIME: 'appInstallTime',
  APP_LAST_UPDATE: 'appLastUpdate',
  APP_LAUNCH_TIME: 'appLaunchTime',
};
export const useAppDeviceEvent = () => {
  const appEvents = useAppDeviceEventStore((state) => state.appEvents);
  const [postDeviceEvent] = usePostDeviceEventMutation();
  const isAndroidFirstInteractionSuccess = useAppStore(
    (state) => state.isAndroidFirstInteractionSuccess
  );
  const getNeedDoReportTime = async (event: AppDeviceEvent) => {
    const appLaunchInfo = sdkUtils.getAppLaunchInfo();
    console.log(
      '@@@evan.appLaunchInfo',
      JSON.stringify(appLaunchInfo, null, 2)
    );
    if (appLaunchInfo && sdkUtils.isInNative()) {
      switch (event) {
        case AppDeviceEvent.BUILD:
          if (appLaunchInfo?.buildTime) {
            const localBuildTime = await appEventFlagStore.getItem<number>(
              Key.APP_BUILD_TIME
            );
            const buildTime = toUnixTimestamp(appLaunchInfo.buildTime);
            return buildTime != 0 && buildTime !== localBuildTime
              ? buildTime
              : 0;
          } else {
            return 0;
          }
        case AppDeviceEvent.INSTALL:
          if (appLaunchInfo?.firstInstallTime) {
            sdkUtils.sendAnalyticsEvent<PostHogEventPayload>({
              event: 'posthog.appInstall',
              postHogType: PostHogPayloadType.APP_INSTALL,
              parameter: '{}',
            });

            const localFirstInstallTime =
              await appEventFlagStore.getItem<number>(Key.APP_INSTALL_TIME);
            const firstInstallTime = toUnixTimestamp(
              appLaunchInfo.firstInstallTime
            );
            return firstInstallTime != 0 &&
              firstInstallTime !== localFirstInstallTime
              ? firstInstallTime
              : 0;
          } else {
            return 0;
          }
        case AppDeviceEvent.LAST_UPDATE:
          if (appLaunchInfo?.lastUpdateTime) {
            const localLastUpdateTime = await appEventFlagStore.getItem<number>(
              Key.APP_LAST_UPDATE
            );
            const lastUpdateTime = toUnixTimestamp(
              appLaunchInfo.lastUpdateTime
            );
            const firstInstallTime = toUnixTimestamp(
              appLaunchInfo?.firstInstallTime || 0
            );

            return lastUpdateTime != 0 &&
              lastUpdateTime > firstInstallTime &&
              lastUpdateTime !== localLastUpdateTime
              ? lastUpdateTime
              : 0;
          } else {
            return 0;
          }
        case AppDeviceEvent.LAUNCH:
          if (appLaunchInfo?.lastLaunch) {
            const localLastLaunch = await appEventFlagStore.getItem<number>(
              Key.APP_LAUNCH_TIME
            );
            const lastLaunch = toUnixTimestamp(appLaunchInfo.lastLaunch);
            return lastLaunch != 0 && lastLaunch !== localLastLaunch
              ? lastLaunch
              : 0;
          } else {
            return 0;
          }
        case AppDeviceEvent.LOGIN:
          return dayjs().unix();
        default:
          return 0;
      }
    } else {
      return 0;
    }
  };

  const saveLocalForageFlag = async (result: DeviceEventResult) => {
    switch (result.event) {
      case AppDeviceEvent.BUILD:
        await appEventFlagStore.setItem<number>(
          Key.APP_BUILD_TIME,
          result.eventTime
        );
        break;
      case AppDeviceEvent.INSTALL:
        await appEventFlagStore.setItem<number>(
          Key.APP_INSTALL_TIME,
          result.eventTime
        );
        break;
      case AppDeviceEvent.LAST_UPDATE:
        await appEventFlagStore.setItem<number>(
          Key.APP_LAST_UPDATE,
          result.eventTime
        );
        break;
      case AppDeviceEvent.LAUNCH:
        await appEventFlagStore.setItem<number>(
          Key.APP_LAUNCH_TIME,
          result.eventTime
        );
        break;
      case AppDeviceEvent.LOGIN:
        break;
    }
  };
  const doDeviceEvent = async (event: AppDeviceEvent) => {
    const reportTime = await getNeedDoReportTime(event);
    if (reportTime > 0) {
      const appLaunchInfo = sdkUtils.getAppLaunchInfo();
      postDeviceEvent({
        buildId: appLaunchInfo?.buildId || '',
        event: event,
        eventTime: reportTime,
        params: '',
      }).then((resp) => {
        if (resp.data) {
          saveLocalForageFlag(resp.data);
        }
      });
    }
  };

  useEffect(() => {
    if (sdkUtils.isInNative()) {
      appEvents.forEach((event) => {
        doDeviceEvent(event);
      });
    }
  }, [appEvents]);

  useEffect(() => {
    if (isAndroidFirstInteractionSuccess) {
      useAppDeviceEventStore
        .getState()
        .setAppEvents([
          AppDeviceEvent.BUILD,
          AppDeviceEvent.INSTALL,
          AppDeviceEvent.LAUNCH,
          AppDeviceEvent.LAST_UPDATE,
        ]);
    }
  }, [isAndroidFirstInteractionSuccess]);
};
