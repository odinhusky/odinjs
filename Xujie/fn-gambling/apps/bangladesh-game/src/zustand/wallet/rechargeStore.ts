import { create } from 'zustand';
import { PayActivationResult } from '@mode2API/endpoint/wallet/PostPayConfigInfoWithOptionsEndpoint';

interface RechargeResult {
  rechargeUrl: string;
  payActivation: PayActivationResult;
  isTransferInGame: boolean;
  timestamp: number;
  txId: string;
  payMethod?: string;
}

export enum RechargeStatusResult {
  NONE = 'NONE',
  EXTERNAL = 'EXTERNAL', // 外部開啟 sdkUtils.openBrowser()
  INTERNAL = 'INTERNAL', // 內部開啟 <iframe>
  CUSTOMIZED = 'CUSTOMIZED', // 自定義收銀台
  FINISH = 'FINISH',
  ERROR = 'ERROR',
}

export enum RechargeFromResult {
  WALLET_PAGE = 'WALLET_PAGE',
  TRANSFER_IN_GAME = 'TRANSFER_IN_GAME',
}

export interface RechargeStoreTypes {
  rechargeFrom: RechargeFromResult;
  setRechargeFrom: (from: RechargeFromResult) => void;
  rechargeStatus: RechargeStatusResult;
  setRechargeStatus: (status: RechargeStatusResult) => void;
  rechargeAmount: string;
  setRechargeAmount: (str: string) => void;
  rechargeResult: RechargeResult;
  setRechargeResult: (result: RechargeResult) => void;
  finishRecharge: () => void;
}
const defaultRechargeResult: RechargeResult = {
  rechargeUrl: '',
  payActivation: PayActivationResult.EXTERNAL,
  isTransferInGame: false,
  timestamp: 0,
  txId: '',
  payMethod: '',
};
export const useRechargeStore = create<RechargeStoreTypes>((set) => ({
  rechargeFrom: RechargeFromResult.WALLET_PAGE,
  setRechargeFrom: (from) => set(() => ({ rechargeFrom: from })),
  rechargeStatus: RechargeStatusResult.NONE,
  setRechargeStatus: (status) => set(() => ({ rechargeStatus: status })),
  rechargeAmount: '',
  setRechargeAmount: (str) => set(() => ({ rechargeAmount: str })),
  rechargeResult: defaultRechargeResult,
  setRechargeResult: (result) =>
    set((state) => {
      // 避免重複
      if (state.rechargeResult.timestamp === result.timestamp) {
        return state;
      } else {
        state.setRechargeStatus(
          result.payActivation === PayActivationResult.INTERNAL
            ? RechargeStatusResult.INTERNAL
            : result.payActivation === PayActivationResult.EXTERNAL
            ? RechargeStatusResult.EXTERNAL
            : RechargeStatusResult.CUSTOMIZED
        );
        return { rechargeResult: result };
      }
    }),

  finishRecharge: () =>
    set((state) => {
      state.rechargeStatus = RechargeStatusResult.FINISH;
      state.rechargeResult = defaultRechargeResult;
      return { ...state };
    }),
}));
