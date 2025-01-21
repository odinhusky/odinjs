import { create } from 'zustand';
import { EventTokenInfoResult } from '@mode2API/endpoint/info/GetEventTokensEndpoint';

export interface AdjustEventTokensStoreTypes {
  eventTokens: EventTokenInfoResult[];
  setEventTokens: (list: EventTokenInfoResult[]) => void;
}

export const useAdjustEventTokensStore = create<AdjustEventTokensStoreTypes>(
  (set) => ({
    eventTokens: [],
    setEventTokens: (list) => set(() => ({ eventTokens: list })),
  })
);
