import { create } from 'zustand';
import { PromoteInviteWheelResult } from '@mode2API/endpoint/promotepParameter/PostPromoteInviteWheelEndpoint';

export interface InviteWheelModalStoreTypes {
  isShowInviteWheelModal: boolean;
  setShowInviteWheelModal: (isShow: boolean) => void;
  isNotShowToday: boolean;
  setIsNotShowToday: (value: boolean) => void;

  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  parameter: PromoteInviteWheelResult;
  setParameter: (value: PromoteInviteWheelResult) => void;
}

export const useInviteWheelModalStore = create<InviteWheelModalStoreTypes>(
  (set, get) => ({
    isShowInviteWheelModal: false,
    setShowInviteWheelModal: (isShow) =>
      set(() => ({
        isShowInviteWheelModal: isShow,
      })),

    isNotShowToday: false,
    setIsNotShowToday: (value) => set(() => ({ isNotShowToday: value })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),

    parameter: {
      withdrawRequire: 0,
    },
    setParameter: (value) => set(() => ({ parameter: value })),
  })
);

export default useInviteWheelModalStore;
