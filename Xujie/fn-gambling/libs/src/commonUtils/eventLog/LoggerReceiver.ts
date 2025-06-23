import { ILoggerReceiver, ILogPayload } from './ICommand';
import { fetchBatch } from '@libs/commonUtils';
import { eventLoggerReportStore } from '@mode2/localforage/stroe';
import dayjs from '@commonUtils/localizedDayjs';

import { mergeRequestData } from '@libs/mode2/external/api/requestInitData';
import { POST_COLLECTION_LOG_FRONTEND_URL } from '@mode2API/urls';

const LOG_MAX_LIMIT = Number(
  import.meta.env['VITE_COLLECTION_LOGGER_MAX_NUMBER'] || 20
);

export class LoggerReceiver
  implements ILoggerReceiver<ILogPayload<{ event: string; params: unknown }>>
{
  lock: boolean = false;

  /**
   * 保存
   * @param logData 日志数据
   * @returns
   */
  public async saveLog(
    logData: ILogPayload<{ event: string; params: unknown }>
  ) {
    // 當前毫秒，作為key
    const now = dayjs().valueOf();
    // 處理 Payload.message to Json string
    const { entry, ...rest } = logData;
    const message = {
      event: entry.event,
      params: entry.params,
    };

    console.log('[CollectionLogger] saveLog ', JSON.stringify(message));
    const payload = {
      ...rest,
      message: JSON.stringify(message),
    };
    // 存入轉 string，並且是已經要直接上報的完整 payload
    await eventLoggerReportStore.setItem(`${now}`, JSON.stringify(payload));
    await this.reportLogs();
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
    await this.clearLog(oldestKeys);
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

  public async saveAll(reports: Record<string, string>) {
    Object.entries(reports).forEach(([key, value]) => {
      eventLoggerReportStore.setItem(key, value);
    });
  }

  /**
   * 上报日志
   * @param reports 上报数据
   * @param callback 回调
   */
  public async reportLogs() {
    const reports = await this.getLogs();
    const keys = Object.keys(reports);
    if (keys.length < LOG_MAX_LIMIT || this.lock) {
      return;
    }

    // 获取所有值
    const values = {
      payloads: Object.values(reports).map((json) => JSON.parse(json)),
    };
    const requestData = await mergeRequestData(values as any);
    console.log('[CollectionLogger] requestData', requestData);
    try {
      this.lock = true;
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
      } else {
        await this.saveAll(reports);
      }
      this.lock = false;
      console.log('%c上报日志', 'color:#FBC012', response);
    } catch (error) {
      this.lock = false;
      console.error('%c上报日志时出错:', 'color:red', error);
    } finally {
      this.lock = false;
    }
  }
}
