export interface PushExtra {}
export interface Push<T, U, Extra extends PushExtra> {
  initPush(): void;

  subscribePush(): void;

  requestPermission(onGrant?: () => void): void;

  registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined>;

  onPushMessage(onPayload?: (onPayload: T) => void): Promise<U> | undefined;

  getPushToken(retryCount: number, delay: number): Promise<string>;

  // 额外的属性或方法
  extra: Extra;
}
