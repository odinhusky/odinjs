import { ILoggerReceiver, ILogPayload } from './ICommand';
import { fetchBatch } from '@libs/commonUtils';
import { eventLoggerReportStore } from '@mode2/localforage/stroe';
import dayjs from 'dayjs';
import { LOG_MAX_LIMIT } from '../../mode2/@types/eventLogType';
import { mergeRequestData } from '@libs/mode2/external/api/requestInitData';
import { POST_COLLECTION_LOG_FRONTEND_URL } from '@mode2API/urls';

export class LoggerReceiver
  implements ILoggerReceiver<ILogPayload<{ event: string; params: any }>>
{
  /**
   * 保存
   * @param logData 日志数据
   * @returns
   */
  public async saveLog(
    logData: ILogPayload<{ event: string; params: any }>
  ): Promise<void> {
    // 當前毫秒，作為key
    const now = dayjs().valueOf();
    // 處理 Payload.message to Json string
    const { entry, ...rest } = logData;
    const payload = {
      ...rest,
      message: JSON.stringify(entry),
    };
    // 存入轉 string，並且是已經要直接上報的完整 payload
    await eventLoggerReportStore.setItem(`${now}`, JSON.stringify(payload));
  }

  /**
   * 获取所有日志
   * @returns 所有数据(对象数据)
   */
  public async getLogs(): Promise<Record<string, string>> {
    const keys = await eventLoggerReportStore.keys();
    keys.sort(); // 确保键按照时间顺序排列
    // 取最旧的20个键，20 可以抽環境變數
    const oldestKeys = keys.slice(0, LOG_MAX_LIMIT);
    // 读取最旧的20条记录
    const logs: Record<string, string> = {};
    for (const key of oldestKeys) {
      const value = await eventLoggerReportStore.getItem<string>(key);
      if (value !== null) {
        logs[key] = value;
      }
    }
    return logs;
  }

  /**
   * 清理数据
   */
  public async clearLog(keys: string[]) {
    for (const key of keys) {
      await eventLoggerReportStore.removeItem(key);
    }
  }

  /**
   * 上报日志
   * @param reports 上报数据
   * @param callback 回调
   */
  public async reportLogs(
    reports: Record<string, string>,
    callback?: (keys: string[]) => void
  ) {
    // 获取所有键
    const keys = Object.keys(reports);
    // 获取所有值
    const values = { payloads: Object.values(reports) };
    const requestData = await mergeRequestData(values as any);
    try {
      //  改用封裝 fetch 有 maxLimit 限制，避免大量連線，造成 network 堵塞
      const response = await fetchBatch(POST_COLLECTION_LOG_FRONTEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (response.status === 200) {
        await this.clearLog(keys);
        callback?.(keys);
      }
      console.log('%c上报日志', 'color:#FBC012', response);
    } catch (error) {
      console.error('%c上报日志时出错:', 'color:red', error);
    }
  }
}
