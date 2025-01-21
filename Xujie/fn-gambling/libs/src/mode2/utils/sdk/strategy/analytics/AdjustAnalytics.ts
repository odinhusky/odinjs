import Adjust from '@adjustcom/adjust-web-sdk';
import {
  Analytics,
  AnalyticsExtra,
  IErrorPayload,
  IEventPayload,
} from '../../interface/Analytics';
import { isEmpty } from 'lodash';
import LogLevel = Adjust.LogLevel;

// 定義額外的類型
interface AdjustExtra extends AnalyticsExtra {
  getUUId: () => Promise<string | undefined>;

  isSupportWebAdjust(): boolean;

  getAttribution: () => Promise<Adjust.Attribution | undefined>;
}

export interface AdjustEventPayload extends IEventPayload {
  eventToken: string;
  name: string;
}

export interface AdjustErrorPayload extends IErrorPayload {
  logLevel: LogLevel;
  exception: string;
}

export const AdjustAnalytics: Analytics<
  AdjustEventPayload,
  AdjustErrorPayload,
  AdjustExtra
> = {
  init(): void {
    // 初始就 掛起
    if (this.extra.isSupportWebAdjust()) {
      return;
    }
    const adjustToken = import.meta.env['VITE_ADJUST_TOKEN'];
    const isDev = import.meta.env.DEV;
    console.log('@@@===> [adjust]', 'init');
    Adjust.initSdk({
      appToken: adjustToken,
      environment: isDev ? 'sandbox' : 'production', //import.meta.env.MODE === 'development' ? 'sandbox' : 'production'
      logLevel: isDev ? 'verbose' : 'none', // type LogLevel = 'none' | 'error' | 'warning' | 'info' | 'verbose'
      logOutput: '#output',
      // defaultTracker: 'YOUR_DEFAULT_TRACKER_TOKEN', // optional
      attributionCallback: (event, attribution) => {
        // e：内部事件名称，可忽略
        // attribution: 发生变更的归因详情
        console.log('@@@===> [adjust]', event, attribution);
      },
    });

    this.extra.getUUId().then((resp) => {
      console.log('@@@===> [adjust] getUUId', resp);
    });
  },
  sendEvent: (payload: AdjustEventPayload) => {
    Adjust.trackEvent(payload).catch((e) => {
      console.log('@@@===>  Adjust.trackEvent Error', e);
    });
  },
  sendError: (payload: AdjustErrorPayload) => {},
  // 實作額外的方法
  extra: {
    getUUId(): Promise<string | undefined> {
      if (this.isSupportWebAdjust()) {
        return Adjust.waitForWebUUID();
      } else {
        return Promise.resolve(undefined);
      }
    },
    isSupportWebAdjust: () => !isEmpty(import.meta.env['VITE_ADJUST_TOKEN']),
    getAttribution(): Promise<Adjust.Attribution | undefined> {
      if (this.isSupportWebAdjust()) {
        return Adjust.waitForAttribution();
      } else {
        return Promise.resolve(undefined);
      }
    },
  },
};
