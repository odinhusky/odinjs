/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    android: any;
    ios: any;
    fakeLocalStorage: { [key: string]: string };

    protobuf: any;
    MSStream: any;

    logEvent: any;
    appAdjustAttribution: any;
    appInstallApps: any;
    appAdjustDeeplinkResponse: any;
    appDeepLink: any;
    appOneSignalId: any;

    __ssc: any;
    ssq: any;
    
    webDeepLink: (path: string, queryString?: string) => Promise<void>;
  }
  interface Navigator {
    standalone?: boolean;
  }
}
