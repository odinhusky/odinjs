import {
  Analytics,
  AnalyticsExtra,
  IErrorPayload,
  IEventPayload,
} from '@mode2/utils/sdk/interface/Analytics';
import sensors from 'sa-sdk-javascript';
import { sensorsDataReportStore } from '@mode2/localforage/stroe';

export enum SensorsEventLabel {
  FIRST = 'first_f',
  CURRENT = 'current_f',
  LAST = 'last_f',
  APP_LIST = 'appList',
  LOGIN = 'login',
  AUTOT_RACKSINGLE_PAGE = 'autoTrackSinglePage',
}

export enum SensorsPayloadType {
  PROFILE = 'PROFILE',
  ONCE_PROFILE = 'ONCE_PROFILE',
  TRACK_APP_LIST = 'AppList',
  LOGIN = 'LOGIN',
  QUICK = 'QUICK',
}

export interface SensorsEventPayload extends IEventPayload {
  sensorsType: SensorsPayloadType;
  label: SensorsEventLabel;
  profile: string;
}

export interface SensorsErrorPayload extends IErrorPayload {
  error: string;
}

interface SensorsAnalyticsExtra extends AnalyticsExtra {
  registerPropertyPlugin: () => void;
}

/**
 * 神策數據
 */
export const SensorsAnalytics: Analytics<
  SensorsEventPayload,
  SensorsErrorPayload,
  SensorsAnalyticsExtra
> = {
  init(): void {
    const envName: string = import.meta.env.DEV
      ? 'dev'
      : import.meta.env['VITE_PACKAGENAME'];
    const serverUrl: string = `https://bi.game-strategy.vip/pixel?app=${envName}`; // 数据接收地址 Evan

    sensors.init({
      server_url: serverUrl, // 数据接收地址 Evan
      app_js_bridge: true, // App是否打通H5
      is_track_single_page: false, // 单页面配置，默认开启，若页面中有锚点设计，需要将该配置删除，否则触发锚点会多触发 $pageview 事件
      use_client_time: true,
      send_type: 'image', // 表示使用 beacon 请求方式发数据，可选使用 'image' 图片 get 请求方式发数据。( 神策系统 1.10 版本以后 ) 支持使用 'ajax' 和 'beacon' 方式发送数据，这两种默认都是 post 方式， beacon 方式兼容性较差。
      show_log: import.meta.env.DEV, // 设置 true 后会在网页控制台打 logger，会显示发送的数据,设置 false 表示不显示。
      debug_mode: false,
      heatmap: {
        /**
         * 是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
         * 默认只有点击 a input button textarea 四种元素时，才会触发 $WebClick 元素点击事件
         */
        clickmap: 'default',
        /**
         * 是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
         * 默认的 4 秒或者自定义的时间是有效停留
         */
        scroll_notice_map: 'not_collect',
        // 全埋点不建议超过3个任意元素标签
        collect_tags: {
          /**
           * 开启div的采集，两个条件：
           * 1 div 为叶子结点（无子元素）时采集 div 的点击；
           * 2 div 中有且只有样式标签（['mark','strong','b','em','i','u','abbr','ins','del','s','sup']）时，点击 div 或者样式标签都采集 div 的点击
           */
          div: true,
        },
      },
      scrollmap: {
        // collect_url: function () {} // 默认采集所有页面
      },
      preset_properties: {
        //是否采集 $latest_utm 最近一次广告系列相关参数，默认值 true。
        latest_utm: false,
        //是否采集 $latest_referrer 最近一次前向地址，默认值 true。
        latest_referrer: false,
        //是否采集 $latest_referrer_host 最近一次前向地址，1.14.8 以下版本默认是true，1.14.8 及以上版本默认是 false，需要手动设置为 true 开启。
        latest_referrer_host: false,
        //是否采集 $latest_traffic_source_type 最近一次流量来源类型，默认值 true。
        latest_traffic_source_type: false,
        //是否采集 $latest_search_keyword 最近一次搜索引擎关键字，默认值 true。
        latest_search_keyword: false,
      },
    });

    // sensors.quick('autoTrack', {
    //   // platform:'h5'
    // });

    this.extra.registerPropertyPlugin();
  },
  sendEvent(payload: SensorsEventPayload): void {
    console.log(
      '@@===>',
      '\nfrom:',
      payload.event,
      '\ntype:',
      payload.sensorsType,
      '\nlabel:',
      payload.label,
      '\nprofile:',
      payload.profile
    );
    try {
      switch (payload.sensorsType) {
        case SensorsPayloadType.PROFILE:
          sensors.setProfile({ [payload.label]: payload.profile });
          break;
        case SensorsPayloadType.ONCE_PROFILE:
          sensors.setOnceProfile({ [payload.label]: payload.profile });
          break;
        case SensorsPayloadType.TRACK_APP_LIST:
          sensors.track(SensorsPayloadType.TRACK_APP_LIST, {
            [payload.label]: JSON.parse(payload.profile || '[]'),
          });
          break;
        case SensorsPayloadType.LOGIN:
          if (payload.profile) {
            sensors.login(payload.profile);
          }
          break;
        case SensorsPayloadType.QUICK:
          sensors.quick(payload.label, JSON.parse(payload.profile) || {});
          break;
      }
    } catch (e) {
      console.log('@@===>', e);
    }
  },
  sendError(): void {},
  extra: {
    registerPropertyPlugin(): void {
      // @ts-expect-error : ""
      sensors.registerPropertyPlugin({
        properties: async (data: { properties: { [key: string]: string } }) => {
          const firstAttribution = await sensorsDataReportStore.getItem<string>(
            SensorsEventLabel.FIRST
          );
          const currentAttribution =
            await sensorsDataReportStore.getItem<string>(
              SensorsEventLabel.CURRENT
            );
          const lastAttribution = await sensorsDataReportStore.getItem<string>(
            SensorsEventLabel.LAST
          );
          data.properties[SensorsEventLabel.FIRST] = firstAttribution || '';
          data.properties[SensorsEventLabel.CURRENT] = currentAttribution || '';
          data.properties[SensorsEventLabel.LAST] = lastAttribution || '';
        },
      });
    },
  },
};
