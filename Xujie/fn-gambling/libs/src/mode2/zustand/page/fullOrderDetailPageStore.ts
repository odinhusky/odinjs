import {
  RechargeQueryReceiptResult,
  RechargeReceiptState,
} from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import { RechargeUploadReceiptResult } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeUploadReceiptEndpoint';
import { create } from 'zustand';

export const initDefaultValues = {
  confirmCode: '',
  state: RechargeReceiptState.UNCOMPLETED,
  receiptFileBase64: '',
  rejectMessage: '',
};

export interface Mode2FullOrderDetailPageStoreTypes {
  orderId: string;
  setorderId: (value: string) => void;
  uploadDeatil: RechargeUploadReceiptResult;
  setUploadDeatil: (value: RechargeUploadReceiptResult) => void;
  fullOrderFile: string;
  setFullOrderFile: (value: string) => void;
  defaultValues: RechargeQueryReceiptResult;
  setDefaultValues: (value: RechargeQueryReceiptResult) => void;

  rechargeQueryReceiptResult: RechargeQueryReceiptResult;
  setRechargeQueryReceiptResult: (value: RechargeQueryReceiptResult) => void;
}

export const useMode2FullOrderDetailPageStore =
  create<Mode2FullOrderDetailPageStoreTypes>()((set) => ({
    orderId: '',
    setorderId: (value) => set(() => ({ orderId: value })),
    uploadDeatil: {} as RechargeUploadReceiptResult,
    setUploadDeatil: (value) => set(() => ({ uploadDeatil: value })),
    fullOrderFile: '',
    setFullOrderFile: (value) => set(() => ({ fullOrderFile: value })),
    defaultValues: initDefaultValues,
    setDefaultValues: (value) => set(() => ({ defaultValues: value })),

    rechargeQueryReceiptResult: {} as RechargeQueryReceiptResult,
    setRechargeQueryReceiptResult: (value) =>
      set(() => ({ rechargeQueryReceiptResult: value })),
  }));
