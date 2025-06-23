import { create } from 'zustand';
import { AnnouncementType } from '@mode2/@types/announcementType';

export interface DynamicActivityModalContent {
  uniqueId: string;
  orderId: number;
  announcementType: AnnouncementType;
  popupBannerUrl: string;
  popupTitle: string;
  popupInnerHtml: string | TrustedHTML;
}

export interface DynamicActivityModalStoreTypes {
  currentUniqueId: string;
  setCurrentUniqueId: (uniqueId: string) => void;
  isShowDynamicActivityModal: boolean;
  setShowDynamicActivityModal: (isShow: boolean) => void;
  appStartShownSeveralTimes: string[];
  updateAppStartShownSeveralTimes: (uniqueId: string) => void;

  currentDynamicContent: DynamicActivityModalContent;
  setCurrentDynamicContent: (content: DynamicActivityModalContent) => void;
}

export const useDynamicActivityModalStore =
  create<DynamicActivityModalStoreTypes>((set, get) => ({
    currentUniqueId: '-1',
    setCurrentUniqueId: (uniqueId) =>
      set(() => ({
        currentUniqueId: uniqueId,
      })),
    isShowDynamicActivityModal: false,
    setShowDynamicActivityModal: (isShow) =>
      set(() => ({
        isShowDynamicActivityModal: isShow,
      })),

    appStartShownSeveralTimes: [],
    updateAppStartShownSeveralTimes: (orderId) =>
      set(() => ({
        appStartShownSeveralTimes: [
          orderId,
          ...get().appStartShownSeveralTimes,
        ],
      })),
    currentDynamicContent: {
      uniqueId: '-1',
      orderId: -1,
      announcementType: AnnouncementType.UNKNOWN,
      popupBannerUrl: '',
      popupTitle: '',
      popupInnerHtml: '',
    },
    setCurrentDynamicContent: (content) =>
      set(() => ({ currentDynamicContent: content })),
  }));

export default useDynamicActivityModalStore;
