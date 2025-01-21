import { Push, PushExtra } from '@mode2/utils/sdk/interface/Push';
import { MessagePayload, Unsubscribe } from 'firebase/messaging';

interface NonePushExtra extends PushExtra {}

export const NonePush: Push<
  MessagePayload,
  Unsubscribe | undefined,
  NonePushExtra
> = {
  initPush(): void {},
  onPushMessage(): Promise<Awaited<undefined>> {
    return Promise.resolve(undefined);
  },

  async registerServiceWorker() {
    return Promise.resolve(undefined);
  },
  requestPermission(): void {},
  subscribePush(): void {},

  getPushToken(retryCount: number, delay: number): Promise<string> {
    return Promise.resolve('');
  },
  extra: {},
};
