import { devtools, persist } from 'zustand/middleware';
import sdkUtils from '../utils/sdk';
import { StateCreator } from 'zustand';
import { zustandStore } from '../localforage/stroe';

type StoreCreator<T> = (set: any, get: any, api: any) => T;
/**
 * - 在(import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1')，處理 setItem 加密[stringValue]， getItem 解密 [value]
 *  sdkUtils.decrypt()
 *  sdkUtils.encryption()
 */
const customStorage = {
  getItem: async (name: string) => {
    const storeValue = (await zustandStore.getItem(name)) as string;

    const decodeValue =
      (import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1') === true
        ? sdkUtils.decrypt(storeValue)
        : storeValue;

    return JSON.parse(decodeValue);
  },
  setItem: async (name: string, value: any) => {
    const stringValue = JSON.stringify(value);
    const storeValue =
      (import.meta.env['VITE_ENABLE_ENCODE_DECODE'] === '1') === true
        ? sdkUtils.encryption(stringValue)
        : stringValue;

    await zustandStore.setItem(name, storeValue);
  },
  removeItem: (name: string) => zustandStore.removeItem(name),
};

export const devtoolsWrapper = <T extends object>(
  name: string,
  cb: StateCreator<T, [], []>
) =>
  devtools(cb, {
    name,
    enabled: import.meta.env.DEV,
  });

export const persistWrapper = <T extends object>(
  name: string,
  cb: StoreCreator<T>
) => {
  // 使用環境變數來決定是否啟用 persist
  const enablePersist = import.meta.env['VITE_ENABLE_PERSIST'] === '1';

  if (enablePersist) {
    return persist(cb, {
      name,
      storage: customStorage,
    });
  } else {
    // 如果 persist 被禁用，直接返回原始的 cb 函數，並且移除該 name 在 indexDB 的位置
    customStorage.removeItem(name);
    return cb;
  }
};

export const devtoolsAndPersistWrapper = <T extends object>(
  name: string,
  cb: StoreCreator<T>
) =>
  devtools(persistWrapper(name, cb), {
    name,
    enabled: import.meta.env.DEV,
  });
