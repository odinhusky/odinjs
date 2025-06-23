import {
  OnlineServiceProvide,
  UserChatProfile,
} from '@mode2/utils/sdk/interface/OnlineServiceProvide';
import isEmpty from 'lodash/isEmpty';

export interface SaleSmartlyUserProfile extends UserChatProfile {
  userName: string;
  description: string;
  labelNames: string[];
}

export const SaleSmartlyChat: OnlineServiceProvide<SaleSmartlyUserProfile> = {
  /**
   * 檢查是否支援 SaleSmartly
   * 條件，有定義 ['VITE_SALE_SMARTLY_API_KEY']
   */
  isSupportThirdPartyChat(): boolean {
    const apiKey: string = import.meta.env['VITE_SALE_SMARTLY_API_KEY'] || '';
    return !isEmpty(apiKey);
  },

  /**
   * 初始 SaleSmartly
   * 使用動態載入 <script type='module'> </script>
   */
  initChat(): void {
    if (this.isSupportThirdPartyChat()) {
      const apiKey: string = import.meta.env['VITE_SALE_SMARTLY_API_KEY'] || '';
      const script = document.createElement('script');
      script.type = 'module';
      script.src = `https://assets.salesmartly.com/js/project_${apiKey}.js`;
      document.head.appendChild(script);
      script.addEventListener('load', () => {
        if (window.__ssc) {
          window.__ssc.setting = { hideIcon: true };
        }
      });
    }
  },
  /**
   * 開啟 Chat
   * @param originalFeature
   * @example
   * SaleSmartlyChat.openChat(() => {
   *   // 不支援走原有行為
   *   if (isLink) {
   *     sdkUtils.openBrowser(target);
   *   } else {
   *     navigate(target);
   *   }
   * })
   *
   * @example // console test
   * > window.ssq.push('chatOpen');
   */
  openChat(originalFeature: () => void): void {
    if (this.isSupportThirdPartyChat()) {
      if (window.ssq) {
        window.ssq.push('chatOpen');
      }
    } else {
      originalFeature();
    }
  },

  /**
   * 登入
   * @param profile
   *
   * @example // isLogin
   * SaleSmartlyChat.setUserProfile({
   *   userName: `${res.Nickname}`, // 对应用户名
   *   description: `username: ${res.Nickname} \n userId: ${res.PlayerId} \n vipLevel: ${res.Level} \n platform: ${packagename} \n deviceId: ${sdkutils.getDeviceID()}`,
   *   labelNames: ['isUser', `${packagename}`],
   * });
   *
   * @example // isGuest or isLogout
   * SaleSmartlyChat.setUserProfile({
   *   userName: `guest_${sdkutils.getDeviceID()}`, // 对应用户名
   *   description: `username: guest \n platform: ${packagename} \n deviceId: ${sdkutils.getDeviceID()}`,
   *   labelNames: ['isGuest', `${packagename}`],
   * });
   */
  setUserChatProfile(profile: SaleSmartlyUserProfile): void {},

  /**
   * 登出 or api resp status 401
   * [The token provided is invalid or has expired]
   */
  clearUserChatProfile(): void {
    if (this.isSupportThirdPartyChat() && window.ssq) {
      window.ssq.push('clearUser');
    }
  },
};
