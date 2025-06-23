import { create } from 'zustand';

export interface PostTGActivityModalParameter {}

export interface PostTGActivityModalStoreTypes {
  isShowPostTGActivityModal: boolean;
  setShowPostTGActivityModal: (isShow: boolean) => void;
  appStartShownSeveralTimes: number;
  updateAppStartShownSeveralTimes: () => void;

  parameter: PostTGActivityModalParameter;
  setParameter: (parameter: PostTGActivityModalParameter) => void;
}

export const usePostTGActivityModalStore =
  create<PostTGActivityModalStoreTypes>((set, get) => ({
    isShowPostTGActivityModal: false,
    setShowPostTGActivityModal: (isShow) =>
      set(() => ({
        isShowPostTGActivityModal: isShow,
      })),

    appStartShownSeveralTimes: 0,
    updateAppStartShownSeveralTimes: () =>
      set(() => ({
        appStartShownSeveralTimes: get().appStartShownSeveralTimes + 1,
      })),

    parameter: {},
    setParameter: (parameter) => set(() => ({ parameter })),
  }));

export default usePostTGActivityModalStore;
