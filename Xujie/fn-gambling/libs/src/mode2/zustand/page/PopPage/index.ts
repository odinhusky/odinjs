import { create } from 'zustand';

export interface PopPageStoreTypes {
  isShowPopPageRegitsterSuccessModal: boolean;
  setShowPopPageRegitsterSuccessModal: (isShow: boolean) => void;

  isShowPopPageLectureModal: boolean;
  setShowPopPageLectrueModal: (isShow: boolean) => void;

  hasToken: boolean;
  setHasToken: (hasToken: boolean) => void;
}

export const usePopPageStore = create<PopPageStoreTypes>((set) => ({
  isShowPopPageRegitsterSuccessModal: false,
  setShowPopPageRegitsterSuccessModal: (isShow) =>
    set(() => ({
      isShowPopPageRegitsterSuccessModal: isShow,
    })),

  isShowPopPageLectureModal: false,
  setShowPopPageLectrueModal: (isShow) =>
    set(() => ({
      isShowPopPageLectureModal: isShow,
    })),

  hasToken: false,
  setHasToken: (hasToken) =>
    set(() => ({
      hasToken,
    })),
}));

export default usePopPageStore;
