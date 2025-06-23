import { reportStore } from '@libs/mode2/localforage/stroe';
import { ReportPayloadUnit, ReportStoreKey } from './types';
import useReportStore from '@libs/mode2/zustand/reportStore';

export const REPORT_MAX_NUMBER =
  import.meta.env['VITE_REPORT_MAX_NUMBER'] || 20;

// 取得整個 queue
const getReportQueue = async (): Promise<ReportPayloadUnit[]> => {
  return (await reportStore.getItem(ReportStoreKey)) || [];
};

// 移除第一筆（dequeue）
const dequeueReportEvent = async () => {
  const queue: ReportPayloadUnit[] =
    (await reportStore.getItem(ReportStoreKey)) || [];
  queue.shift(); // 移除第一筆
  await reportStore.setItem(ReportStoreKey, queue);
};

// 設置整筆
export const setReportQueueToIndexDB = async (queue: ReportPayloadUnit[]) => {
  await reportStore.setItem(ReportStoreKey, queue);
};

// 清空 queue
export const clearReportQueueFromIndexDB = async () => {
  await reportStore.setItem(ReportStoreKey, []);
};

// ! 棄用
// export const addReportEventToIndexDB = async (payload: ReportPayloadUnit) => {
//   try {
//     // 讀取目前存在的 queue，如果沒有則預設為空陣列
//     const currentQueue: ReportPayloadUnit[] =
//       (await reportStore.getItem(ReportStoreKey)) || [];
//     const currentStoreQueue = useReportStore.getState().reportQueue;

//     // 加入新的 payload 到 queue 中
//     currentQueue.push(payload);

//     // 如果大於等於 20 筆的話，則要提交 API 給後端上報，沒有的話則紀錄
//     if (currentQueue.length >= REPORT_MAX_NUMBER) {
//       // 設定通知要打 API
//       useReportStore.getState().addReportCount();
//       useReportStore.getState().setReportQueue(currentQueue);
//     } else {
//       // 儲存更新後的 queue
//       await reportStore.setItem(ReportStoreKey, currentQueue);
//     }
//   } catch (error) {
//     console.error('Failed to add report event to queue:', error);
//   }
// };

export const addReportEventToZustand = async (payload: ReportPayloadUnit) => {
  if (payload.action) {
    const queue = useReportStore.getState().reportQueue;
    useReportStore.getState().setReportQueue([...queue, payload]);
  }
};
