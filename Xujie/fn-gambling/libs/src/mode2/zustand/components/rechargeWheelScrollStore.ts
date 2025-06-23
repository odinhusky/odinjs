import { create } from 'zustand';

export interface NewsTickerMarqueeUnit {
  id: string;
  broadcastText: string;
}

export interface RebateRewardModalStoreTypes {
  newsTickerMarqueeList: NewsTickerMarqueeUnit[];
  setNewsTickerMarqueeList: (list: NewsTickerMarqueeUnit[]) => void;
}

export const useRechargeWheelScrollStore =
  create<RebateRewardModalStoreTypes>()((set) => ({
    newsTickerMarqueeList: [],
    setNewsTickerMarqueeList: (list) =>
      set(() => ({ newsTickerMarqueeList: list })),
  }));
