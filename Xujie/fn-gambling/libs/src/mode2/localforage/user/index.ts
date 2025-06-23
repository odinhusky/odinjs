import localforage from 'localforage';
import { LocalforageNameKeys } from '@mode2/localforage/localforageKeys';
import { useUserProfileStore } from '@mode2/zustand/user/userProfileStore';

export enum UserLocalforageStoreKeys {
  FIRST_CHARGE = 'firstChargeData',
  RANKING_ACTIVITY = 'rankingActivityData',
  TASK_LIST = 'taskListData',
  DEPOSIT_ADVERTISEMENT = 'depositAdvertisement',
  LAST_HIGH_BONUS_LIMITED_TIME = 'lastHighBonusLimitedTime',
  COUNT_DOWN = 'countDown',
  BONUS_POPUP_INFO = 'bonusPopupInfo',
  INVITE_TIME = 'inviteTime',
  RECENT_GAME_LIST = 'recentGameList',
  INVITE_WHEEL_MODAL = 'InviteWheelModal',
  REPORT_EVENTS = 'ReportEvents',
  STAYT_RACKER = 'stayTrackerLogs',
  BIND_PLAYER_PHONE_WEAK_TIPS = 'bindPlayerPhoneWeakTips',
}

interface UserLocalForageInstancePool {
  [key: string]: LocalForage;
}

class UserLocalforage {
  private pool: UserLocalForageInstancePool = {};

  // 根據 storeName 獲取或創建 localforage 實例
  getInstance(storeName: UserLocalforageStoreKeys): LocalForage {
    if (this.pool[storeName]) {
      return this.pool[storeName];
    }

    const instance = localforage.createInstance({
      name: LocalforageNameKeys.USER_CHARGE,
      storeName,
    });
    this.pool[storeName] = instance;
    return instance;
  }

  // 釋放實例，清理緩存等
  releaseInstance(storeName: UserLocalforageStoreKeys): void {
    if (this.pool[storeName]) {
      delete this.pool[storeName];
    }
  }

  /**
   * 方便只是單純使用get
   * @param storeName
   */
  async getItem<T>(storeName: UserLocalforageStoreKeys): Promise<T | null> {
    const userId = useUserProfileStore.getState().id;
    return await this.getInstance(storeName).getItem<T>(userId.toString());
  }

  /**
   * 方便只是單純使用set
   * @param storeName
   */
  async setItem<T>(storeName: UserLocalforageStoreKeys, data: T): Promise<T> {
    const userId = useUserProfileStore.getState().id;
    return this.getInstance(storeName).setItem<T>(userId.toString(), data);
  }
}

export default new UserLocalforage();
