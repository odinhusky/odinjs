import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@libs/mode2/localforage/user';
import sdkUtils from '@libs/mode2/utils/sdk';
import { PropsValue, StayType } from './usePageTracker';

interface StayRecord {
  from_id: string;
  from_props?: PropsValue;
  to_id: string;
  to_props?: PropsValue;
  duration_ms: string;
  timestamp: string;
  is_logged_in: boolean;
  user_id: number;
  stay_type?: StayType; // page | tab | modal
}

const MAX_BATCH = 20;

export const StayTrackerStore = {
  async append({ record }: { record: StayRecord }) {
    const stayTrackerValue = await userLocalForage.getItem<string>(
      UserLocalforageStoreKeys.STAYT_RACKER
    );

    const value = JSON.parse(sdkUtils.decrypt(stayTrackerValue!));
    const localDataMap = value || [];

    const updated: StayRecord[] = [...localDataMap, record];

    userLocalForage.setItem(
      UserLocalforageStoreKeys.STAYT_RACKER,
      sdkUtils.encryption(JSON.stringify(updated))
    );

    setTimeout(() => {
      this.getAll();
    }, 200);

    // console.log('[stayTracker] 📝 記錄', record);
    if (updated.length > MAX_BATCH) {
      await StayTrackerStore.flush();
    }
  },

  async flush() {
    const data = await StayTrackerStore.getAll();

    if (!data || data.length === 0) return;

    const batch = data.slice(0, MAX_BATCH);
    const remaining = data.slice(MAX_BATCH);

    console.log('[stayTracker] ⚡️ 批量上報', batch.length, '條', batch);

    await userLocalForage.setItem(
      UserLocalforageStoreKeys.STAYT_RACKER,
      sdkUtils.encryption(JSON.stringify(remaining))
    );

    this.getAll();
  },

  // 所有紀錄
  async getAll() {
    const stayTrackerValue = await userLocalForage.getItem<string>(
      UserLocalforageStoreKeys.STAYT_RACKER
    );

    const value = JSON.parse(sdkUtils.decrypt(stayTrackerValue!));
    const localDataMap = value || [];

    console.log('[stayTracker] 👀 所有紀錄', localDataMap);

    return localDataMap;
  },
};
