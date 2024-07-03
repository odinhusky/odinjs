export type UVersions =
  | 'u1'
  | 'u2'
  | 'p1'
  | 'u5'
  | 'wild777bet'
  | 'u6'
  | 'u7'
  | 'u9';
export type UComponentConfig = {
  loginModal?: number;
  debugger?: boolean;
};
export type IEnvironment = {
  production: boolean;
  uVersion: string;
  mVersion: string;
  mvVersion: string;
  mockBackend: boolean;
  captcha: string;
  baseUrl: string;
  platformName: string;
  platformGroup: string;
  appPackageName: string;
  appVersion: string;
  s3URLImages: string;
  snowEffects: string;
  backgroundVideoUrl: string;
  componentConfig?: UComponentConfig;
};
