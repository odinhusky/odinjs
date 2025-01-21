import sdkUtils from '../../utils/sdk/index';
import { Md5 } from 'ts-md5';
import { RequestStructure } from '@mode2API/endpoint/RequestStructure';
import sortKeys from 'sort-keys';
import { FetchMyIp } from '@commonUtils/fetchMyIp';
import { useAppStore } from '@mode2/zustand/appStore';
import { useFetchMyIpStore } from '@mode2/zustand/fetchMyIpStore';

interface ConfigData {
  [key: string]: unknown;
}

/** request資料中塞入初始化資料 */
export const mergeRequestData = async (
  reqData: ConfigData = {}
): Promise<RequestStructure<ConfigData>> => {
  const initDataStructure = await initData(reqData);
  return {
    ...initDataStructure,
    reqData: reqData,
  };
};

export const initData = async (reqData: ConfigData) => {
  const timeStamp = Date.now();
  const hashPrefix: string = '1000001'; // 不可動
  // NOTICE reqData的key必须按照A-Z进行排序
  const md5str: string =
    hashPrefix + timeStamp + JSON.stringify(sortKeys(reqData));

  const os: string = sdkUtils.getOs();
  const sign: string = Md5.hashStr(md5str);
  const device: string = sdkUtils.getDeviceID();
  const ip: string = useFetchMyIpStore.getState().ip;
  const appId: string = sdkUtils.getAppId();
  const platform: string = import.meta.env['VITE_PACKAGENAME'];
  const gpsAdid: string = useAppStore.getState().googleADID;
  // (await sdkUtils.getGoogleADID(2, 300)) as string;
  const adid: string = useAppStore.getState().adjustADID;
  // (await sdkUtils.getAdjustADID(2, 300)) as string;
  const packageName: string = sdkUtils.getAppName();
  const client: string = useAppStore.getState().reqClientParameter;
  const apkVersion = sdkUtils.getAppVersionName();
  const h5Version = sdkUtils.getH5VersionName();
  const data = {
    os,
    sign,
    device,
    timeStamp,
    reqData,
    ip,
    appId,
    platform,
    gpsAdid,
    adid,
    packageName,
    client,
    apkVersion,
    h5Version,
  };
  return data;
};
