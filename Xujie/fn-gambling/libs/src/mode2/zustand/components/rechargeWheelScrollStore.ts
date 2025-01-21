import { create } from 'zustand';
import { devtoolsWrapper } from '../middlewareWrapper';

export interface NewsTickerMarqueeUnit {
  id: string;
  broadcastText: string;
}

export interface RebateRewardModalStoreTypes {
  newsTickerMarqueeList: NewsTickerMarqueeUnit[];
  setNewsTickerMarqueeList: (list: NewsTickerMarqueeUnit[]) => void;
}

export const useRechargeWheelScrollStore =
  create<RebateRewardModalStoreTypes>()(
    devtoolsWrapper('[component store] useRechargeWheelScrollStore', (set) => ({
      newsTickerMarqueeList: [],
      setNewsTickerMarqueeList: (list) =>
        set(() => ({ newsTickerMarqueeList: list })),
    }))
  );
