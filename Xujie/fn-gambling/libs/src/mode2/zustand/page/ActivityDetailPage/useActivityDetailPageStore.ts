import { create } from 'zustand';
import { AnnouncementType } from '@mode2/@types/announcementType';

export interface DynamicActivityContent {
  orderId: number;
  announcementType: AnnouncementType;
  bannerUrl: string;
  title: string;
  innerHtml: string | TrustedHTML;
}

export interface ActivityDetailPageStoreTypes {
  currentAnnouncementType: AnnouncementType;
  setCurrentAnnouncementType: (value: AnnouncementType) => void;
  currentOrderId: number;
  setCurrentOrderId: (value: number) => void;
  currentDynamicContent: DynamicActivityContent;
  setCurrentDynamicContent: (content: DynamicActivityContent) => void;
}

export const useActivityDetailPageStore = create<ActivityDetailPageStoreTypes>(
  (set) => ({
    currentAnnouncementType: AnnouncementType.UNKNOWN,
    setCurrentAnnouncementType: (value) =>
      set(() => ({ currentAnnouncementType: value })),
    currentOrderId: 0,
    setCurrentOrderId: (value) => set(() => ({ currentOrderId: value })),
    currentDynamicContent: {
      orderId: -1,
      announcementType: AnnouncementType.UNKNOWN,
      bannerUrl: '',
      title: '',
      innerHtml: '',
    },
    setCurrentDynamicContent: (content) =>
      set(() => ({ currentDynamicContent: content })),
  })
);
