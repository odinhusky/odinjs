export interface IAxiosCustomConfig {
  // requireToken?: boolean; // 在 interceptors  自動阻擋需要 token 的 API
  // needInitial?: boolean; // 是否要加入iniData
}
export type RequestStructure<T> = {
  sign: string; // "3f718096b4253340af7c6ef00ee4bd72"
  device: string;
  timeStamp: number; //1717127904452
  reqData: T;
  ip: string;
  appId: string;
  platform: string;
  gpsAdid: string;
  adid: string;
  packageName?: string;
  client: string;
  config?: IAxiosCustomConfig;
};
