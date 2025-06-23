import { JsBridge } from './interface/JsBridge';
import { Storage } from './interface/Storage';
import { AndroidStrategy } from './strategy/AndroidStrategy';
import { IosStrategy } from './strategy/IosStrategy';
import { WebStrategy } from './strategy/WebStrategy';
import { Common } from './interface/Common';
import { DESCrypto } from './interface/DESCrypto';
import { AnalyticsProviders } from '@mode2/utils/sdk/interface/AnalyticsProviders';
import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import { MessagePayload, Unsubscribe } from 'firebase/messaging';
import { OnlineServiceProvide } from '@mode2/utils/sdk/interface/OnlineServiceProvide';
import { SaleSmartlyUserProfile } from '@mode2/utils/sdk/strategy/onlineService/SaleSmartlyChart';
import { State } from '@mode2/utils/sdk/interface/State';

const sdkUtils: Common &
  DESCrypto &
  JsBridge &
  Storage &
  AnalyticsProviders &
  Push<MessagePayload, Unsubscribe | undefined, PushExtra> &
  OnlineServiceProvide<SaleSmartlyUserProfile> &
  State = (() => {
  // Evan 有些 apk 的 JSBridge 空間命名一樣是 window.android
  // 比如TG apk 內建的 WebView 也是用 window.android 作為JS交互的空間命名
  // 需增加更多決策判斷
  if (window.android && window.android.getChannelID) {
    return AndroidStrategy;
  } else if (window.ios && window.ios.getChannelID) {
    return IosStrategy;
  } else {
    return WebStrategy;
  }

  // if (window.android) {
  //   return AndroidStrategy;
  // } else if (window.ios) {
  //   return IosStrategy;
  // } else {
  //   return WebStrategy;
  // }
})();

export default sdkUtils;
