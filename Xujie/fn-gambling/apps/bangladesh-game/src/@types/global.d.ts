export {};

declare global {
  interface Window {
    android: any;
    ios: any;
    fakeLocalStorage: { [key: string]: string };
    // eslint-disable-next-line
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
  }
  interface Navigator {
    standalone?: boolean;
  }
}
