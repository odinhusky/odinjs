import { create } from 'zustand';

interface IPinduoduoFreeDrawModalStore {
  pinduoduoFreeDrawModalVisible: boolean;
  setPinduoduoFreeDrawModalVisible: (visible: boolean) => void;
  rewardNum: number;
  setRewardNum: (value: number) => void;
  isRewardGetSuccess: number;
  setIsRewardGetSuccess: (value: number) => void;
  modalAnim: string;
  setModalAnim: (setModalAnim: string) => void;
  participateNumber: number;
  setParticipateNumber: () => void;
  selectBoxIndex: number;
  setSelectBoxIndex: (index: number) => void;
  resetState: () => void;
}

export const usePinduoduoFreeDrawModalStore =
  create<IPinduoduoFreeDrawModalStore>((set, get) => ({
    pinduoduoFreeDrawModalVisible: false,
    setPinduoduoFreeDrawModalVisible: (value: boolean) => {
      set({ pinduoduoFreeDrawModalVisible: value });
    },
    rewardNum: 0,
    setRewardNum: (value: number) => {
      set({ rewardNum: value });
    },
    isRewardGetSuccess: -1,
    setIsRewardGetSuccess: (value: number) => {
      set({ isRewardGetSuccess: value });
    },
    modalAnim: '',
    setModalAnim: (value: string) => {
      set({ modalAnim: value });
    },
    participateNumber: -1,
    setParticipateNumber: () => {
      set({ participateNumber: get().participateNumber + 1 });
    },
    selectBoxIndex: 0,
    setSelectBoxIndex: (value: number) => set({ selectBoxIndex: value }),
    resetState: () =>
      set(() => ({
        pinduoduoFreeDrawModalVisible: false,
        rewardNum: 0,
        isRewardGetSuccess: -1,
        modalAnim: '',
        selectBoxIndex: 0,
      })),
  }));
