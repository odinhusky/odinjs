import { create } from 'zustand';

export interface GlobalNoticeData {
  title: string;
  message: string;
  isShowCloseButton: boolean;
  isShowActionButton: boolean;
}

export interface GlobalAnnouncementModalStoreTypes {
  isShowGlobalAnnouncementModal: boolean;
  setShowGlobalAnnouncementModal: (isShow: boolean) => void;
  globalNoticeData: GlobalNoticeData;
  setGlobalNoticeData: (value: GlobalNoticeData) => void;
}

export const useGlobalAnnouncementStore =
  create<GlobalAnnouncementModalStoreTypes>((set) => ({
    isShowGlobalAnnouncementModal: false,
    setShowGlobalAnnouncementModal: (isShow) =>
      set(() => ({ isShowGlobalAnnouncementModal: isShow })),
    globalNoticeData: {
      title: '',
      message: '',
      isShowCloseButton: false,
      isShowActionButton: false,
    } as GlobalNoticeData,
    setGlobalNoticeData: (value) => set(() => ({ globalNoticeData: value })),
  }));

export default useGlobalAnnouncementStore;
