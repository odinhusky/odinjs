import { create } from 'zustand';
import { AppDeviceEvent } from '@mode2API/endpoint/event/PostDeviceEventEndpoint';

export interface AppDeviceEventStoreTypes {
  appEvents: AppDeviceEvent[];
  setAppEvents: (events: AppDeviceEvent[]) => void;
}

/**
 * app device 事件資訊相關
 */
export const useAppDeviceEventStore = create<AppDeviceEventStoreTypes>()(
  (set) => ({
    appEvents: [],
    setAppEvents: (events) => set(() => ({ appEvents: events })),
  })
);
