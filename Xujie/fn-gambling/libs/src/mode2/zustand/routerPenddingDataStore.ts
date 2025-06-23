import { create } from 'zustand';
import { BasePagePaths } from '../routerTypes/types';

type Params = Record<'tab', string>;

interface IRouterPenddingDataStore {
  penddingData: Map<BasePagePaths, Params>;
  setRouterPenddingData: (path: BasePagePaths, params: Params) => void;
  clearAllPaths: () => void;
}

/**
 * 需求：一個Page多個Tab下的Content，切出去之後再返回要停留在切出之前的Tab
 * 在bottom切換路由時，清除所有數據
 */
export const useRouterPenddingDataStore = create<IRouterPenddingDataStore>(
  (set, get) => ({
    penddingData: new Map(),
    setRouterPenddingData: (path: BasePagePaths, params: Params) => {
      const newPenddingData = new Map(get().penddingData);
      newPenddingData.set(path, params);
      set({ penddingData: newPenddingData });
    },
    clearAllPaths: () => {
      const pathCount = get().penddingData.size;
      if (pathCount > 0) {
        set({ penddingData: new Map() });
      }
    },
  })
);
