import { CustomerServicesResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export interface PlatformServicesStore {
  servicesList: CustomerServicesResult[];
  setServicesList: (list: CustomerServicesResult[]) => void;
}

/**
 * 平台服務相關，
 * [客服電話，線上服務，客服信箱]
 */
export const usePlatformServicesStore = create<PlatformServicesStore>()(
  devtoolsAndPersistWrapper(
    '[platform store] usePlatformServicesStore',
    (set) => ({
      servicesList: [] as CustomerServicesResult[],
      setServicesList: (list) => set(() => ({ servicesList: list })),
    })
  )
);
