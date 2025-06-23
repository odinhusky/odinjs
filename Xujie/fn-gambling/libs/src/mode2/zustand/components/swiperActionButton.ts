import { create } from 'zustand';

interface SwiperActionButtonStoreTypes {
  isShowSwiperActionButtonSpecialBoost: boolean;
  setIsShowSwiperActionButtonSpecialBoost: (bool: boolean) => void;

  isShowSwiperActionButtonDepositJackpotWheel: boolean;
  setIsShowSwiperActionButtonDepositJackpotWheel: (bool: boolean) => void;

  isCountDownSwiperActionButtonDepositJackpotWheel: boolean;
  setIsCountDownSwiperActionButtonDepositJackpotWheel: (bool: boolean) => void;
}

export const swiperActionButtonStores = create<SwiperActionButtonStoreTypes>()(
  (set) => ({
    isShowSwiperActionButtonSpecialBoost: true,
    setIsShowSwiperActionButtonSpecialBoost: (bool) =>
      set(() => ({ isShowSwiperActionButtonSpecialBoost: bool })),

    // 控制是否出現按鈕
    isShowSwiperActionButtonDepositJackpotWheel: true,
    setIsShowSwiperActionButtonDepositJackpotWheel: (bool) =>
      set(() => ({ isShowSwiperActionButtonDepositJackpotWheel: bool })),

    // 控制是否出現倒數的樣子
    isCountDownSwiperActionButtonDepositJackpotWheel: false,
    setIsCountDownSwiperActionButtonDepositJackpotWheel: (bool) =>
      set(() => ({ isCountDownSwiperActionButtonDepositJackpotWheel: bool })),
  })
);
