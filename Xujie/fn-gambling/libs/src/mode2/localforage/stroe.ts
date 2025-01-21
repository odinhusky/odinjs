import localforage from 'localforage';
import {
  LocalforageNameKeys,
  LocalforageStoreKeys,
} from '@mode2/localforage/localforageKeys';

import userLocalForage, {
  UserLocalforageStoreKeys,
} from '@mode2/localforage/user';

// 創建存放圖片的 store
export const imageStore = localforage.createInstance({
  name: LocalforageNameKeys.DEFAULT,
  storeName: LocalforageStoreKeys.IMAGES, // 這裡是你自定義的分類名稱
});

// 創建存放 Zustand 資料的 store
export const zustandStore = localforage.createInstance({
  name: LocalforageNameKeys.DEFAULT,
  storeName: LocalforageStoreKeys.ZUSTAND_DATA, // 另一個自定義的分類名稱
});

// 創建存放 [BI] sensors Data Report Store
export const sensorsDataReportStore = localforage.createInstance({
  name: LocalforageNameKeys.SENSORS_DATA_REPORT,
});

// 創建存放 event logger Report Store
export const eventLoggerReportStore = localforage.createInstance({
  name: LocalforageNameKeys.EVENT_LOGGER_REPORT,
});

// 創建存放 count Down 的 store
export const countDownStore = userLocalForage.getInstance(
  UserLocalforageStoreKeys.COUNT_DOWN
);

// 刪除舊有的資料庫，過一陣子再拿掉
const request = indexedDB.deleteDatabase('localforage');

request.onsuccess = function () {
  console.log('資料庫成功刪除');
};

request.onerror = function () {
  console.error('刪除資料庫時發生錯誤');
};

request.onblocked = function () {
  console.warn('資料庫正在使用中，刪除操作被阻止');
};
