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
  if (window.android) {
    return AndroidStrategy;
  } else if (window.ios) {
    return IosStrategy;
  } else {
    return WebStrategy;
  }
})();

export default sdkUtils;
