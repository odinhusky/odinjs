import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';
import isEmpty from 'lodash/isEmpty';
import { fetchBatch } from '@commonUtils/fetchBatch';

interface FetchMyIpResponse {
  country?: string;
  countryName?: string;
  ip?: string;
  ipAddress?: string;
}

type FetchMyIpResult = {
  ip: string;
  country: string;
};

export const FetchMyIp = {
  async doFetchMyIp(): Promise<FetchMyIpResult> {
    const store = useFetchMyIpStore.getState();
    if (!isEmpty(store.ip) || store.isFetching) {
      return { ip: store.ip, country: store.country };
    }

    const apis: string[] = [
      'https://api.ip.sb/geoip',
      // 'https://www.iplocate.io/api/lookup',
      'https://api.db-ip.com/v2/free/self',
    ];

    store.setFetching(true);
    // 封装 fetch 请求的类型
    const requests: Promise<FetchMyIpResponse>[] = apis.map((url) =>
      fetchBatch(url).then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
    );
    try {
      // 使用 Promise.race 返回第一个成功的请求结果，且包含 country 或 countryName
      const response: FetchMyIpResponse = await Promise.race(
        requests.map((req) =>
          req.then((data) => {
            // 检查 country 或 countryName 是否存在
            if (data.country || data.countryName) {
              return data;
            }
            store.setFetching(false);
            throw new Error('No country or countryName found');
          })
        )
      );

      // 提取 country 或 countryName
      const ip = response.ip || response.ipAddress || '';
      const country = response.country || response.countryName || '';
      store.setIpAndCountry(ip, country);
      store.setFetching(false);
      return { ip: ip, country: country };
    } catch (error) {
      store.setFetching(false);
      return { ip: '', country: '' };
      // console.error('Error fetching IP or country:', error.message);
    }
  },
};
