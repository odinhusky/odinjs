import { create } from 'zustand';
import {
  AnnouncementResult,
  BroadcastItemResult,
  CarouselItemResult,
} from '@mode2API/endpoint/user/PostHomeEndpoint';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export interface PlatformNotifyStoreTypes {
  broadcastItems: BroadcastItemResult[];
  setBroadcastItems: (list: BroadcastItemResult[]) => void;
  carouselItems: CarouselItemResult[];
  setCarouselItems: (list: CarouselItemResult[]) => void;
  announcementsItems: AnnouncementResult[];
  setAnnouncementsItems: (list: AnnouncementResult[]) => void;
  apkInfoId: number;
  setApkInfoId: (id: number) => void;
}

/**
 * 平台通知相關
 * [站內信，公知，廣播，公告，跑馬燈訊息，]
 */
export const usePlatformNotifyStore = create<PlatformNotifyStoreTypes>()(
  devtoolsAndPersistWrapper(
    '[platform store] usePlatformNotifyStore',
    (set) => ({
      broadcastItems: [] as BroadcastItemResult[],
      setBroadcastItems: (list) => set(() => ({ broadcastItems: list })),
      carouselItems: [] as CarouselItemResult[],
      setCarouselItems: (list) => set(() => ({ carouselItems: list })),
      announcementsItems: [] as AnnouncementResult[],
      setAnnouncementsItems: (list) =>
        set(() => ({ announcementsItems: list })),
      apkInfoId: -1,
      setApkInfoId: (id) => set(() => ({ apkInfoId: id })),
    })
  )
);
