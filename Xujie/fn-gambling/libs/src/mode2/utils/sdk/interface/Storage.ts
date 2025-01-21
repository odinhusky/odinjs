import { AppLocalStorageKey } from '@mode2/utils/sdk/persistant/storageKey';

export interface Storage {
  /**
   * 取得偏好儲存
   * @param key
   */
  getStorage(key: AppLocalStorageKey): string | null;

  /**
   * 設置偏好儲存
   * @param key
   * @param value
   */
  setStorage(key: AppLocalStorageKey, value: string): void;

  /**
   * 刪除
   * @param key
   */
  removeStorage(key: AppLocalStorageKey): void;
}
