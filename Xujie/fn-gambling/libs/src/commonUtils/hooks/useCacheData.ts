import { useState } from 'react';
import useDeepEffect from './useDeepEffect';
import { imageStore } from '@libs/mode2/localforage/stroe';
import dayjs from '@commonUtils/localizedDayjs';

type CacheData<F> = {
  data: F;
  lastUpdateTime: number;
};

// value 或是 fetcher function 只能擇一傳入
type UseCacheDataProps<T, F> =
  | { keyName: string; value: T; fetcher?: never; cacheDuration?: number }
  | {
      keyName: string;
      fetcher: () => Promise<F>;
      value?: never;
      cacheDuration?: number;
    };

// T 代表 cacheData 的型別
// F 代表 fetcher return 以及會存在 cachedItem.data 中的型別
export const useCacheData = <T, F>({
  keyName,
  value = undefined, // 新增的 value 參數
  fetcher = undefined, // 讓 fetcher 可選
  cacheDuration = 30 * 24 * 60 * 60 * 1000, // 預設30天
}: UseCacheDataProps<T, F>) => {
  const [cacheData, setCacheData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [objectUrl, setObjectUrl] = useState<string>('');

  // 如果今天 fetch 完的東西是圖片的話，則用 URL 將 blob 物件轉換，並且記錄 ObjectUrl，等 unmount 的時候清理避免 memory leak
  const judgeCacheData = (cachedItem: CacheData<F>) => {
    if (
      cachedItem.data instanceof Blob &&
      cachedItem.data.type.startsWith('image/')
    ) {
      const url = URL.createObjectURL(cachedItem.data);

      setObjectUrl(url);
      return url as unknown as T;
    } else {
      return cachedItem.data as unknown as T;
    }
  };

  useDeepEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const currentTime = dayjs().startOf('day').unix();

        // 從 imageStore 取得緩存的資料
        const cachedItem = await imageStore.getItem<CacheData<F>>(keyName);

        if (
          cachedItem &&
          currentTime - cachedItem.lastUpdateTime < cacheDuration
        ) {
          // 如果緩存存在，且還沒過期
          const data = judgeCacheData(cachedItem);
          setCacheData(data);
        } else {
          // 如果有 value 傳入，直接使用 value 並存儲
          if (value !== undefined) {
            const newData: CacheData<T> = {
              data: value,
              lastUpdateTime: currentTime,
            };
            await imageStore.setItem(keyName, newData);
            setCacheData(value);
          }
          // 如果有 fetcher，調用 fetcher 並存儲結果
          else if (fetcher) {
            const fetchedData = await fetcher();
            // const fetchedData = await limit(() => fetcher());

            const newData: CacheData<F> = {
              data: fetchedData,
              lastUpdateTime: currentTime,
            };

            await imageStore.setItem(keyName, newData);

            const data = judgeCacheData(newData);
            setCacheData(data);
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // 清理 objectUrl 避免 memory leak
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [keyName, value, fetcher]);

  return {
    cacheData,
    loading,
    error,
  };
};

export default useCacheData;
