import { create } from 'zustand';

interface IRechargeNoticeModalStore {
  rechargeNoticeModalVisible: boolean;
  setRechargeNoticeModalVisible: (visible: boolean) => void;
}

export const useRechargeNoticeModalStore = create<IRechargeNoticeModalStore>(
  (set) => ({
    rechargeNoticeModalVisible: false,
    // dayjs().unix() >
    // Number(sdkUtils.getStorage(AppLocalStorageKey.RECHARGE_NOTICE_POPUP)),
    // NOTE FRONTEND-2225， 先停用該功能
    setRechargeNoticeModalVisible: (value: boolean) =>
      set({ rechargeNoticeModalVisible: false }),
  })
);
