import { RechargeReceiptState } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import {
  RechargeRecordItemResult,
  RechargeRecordStatus,
} from '@libs/mode2/external/api/endpoint/record/PostRechargeRecordsEndpoint';
import { WithdrawRecordItemResult } from '@libs/mode2/external/api/endpoint/record/PostWithdrawRecordsEndpoint';
import { create } from 'zustand';

export type TOrderDetailTabUnitValue = 1 | 7 | 30;

export type OrderDetailData = (
  | RechargeRecordItemResult
  | WithdrawRecordItemResult
) & {
  UTRCode?: string;
  UTRState?: RechargeReceiptState;
  withdrawType?: string;
  payType?: string;
  failedTime?: number;
};

export interface IOrderDetailTabUnit {
  label: string;
  value: TOrderDetailTabUnitValue;
}

export interface IOrderDetailListType {
  amount: number;
  orderNumber: string;
  bonus: number;
  status: RechargeRecordStatus;
  timestamp: number;
  message: string;
  payType: string;
  UTRState: RechargeReceiptState;
}

interface useMode2OrderDetailPageType {
  orderListTabIndex: TOrderDetailTabUnitValue;
  setOrderListTabIndex: (index: TOrderDetailTabUnitValue) => void;
  orderListTabList: IOrderDetailTabUnit[];
  setOrderListTabList: (value: IOrderDetailTabUnit[]) => void;
  orderList: IOrderDetailListType[];
  setOrderList: (orderList: IOrderDetailListType[]) => void;

  isShowOrderDetailModal: boolean;
  setShowOrderDetailModal: (visible: boolean) => void;

  currentOrderId: string;
  setCurrentOrderId: (orderId: string) => void;

  orderDetail: OrderDetailData;
  setOrderDetail: (orderDetail: OrderDetailData) => void;
}

export const useMode2OrderDetailPageStore =
  create<useMode2OrderDetailPageType>()((set) => ({
    orderList: [] as IOrderDetailListType[],
    setOrderList: (value) => set({ orderList: value }),
    orderListTabIndex: 1,
    setOrderListTabIndex: (value) => set({ orderListTabIndex: value }),
    orderListTabList: [],
    setOrderListTabList: (value) => set({ orderListTabList: value }),

    isShowOrderDetailModal: false,
    setShowOrderDetailModal: (visible) =>
      set({ isShowOrderDetailModal: visible }),
    currentOrderId: '',
    setCurrentOrderId: (orderId) => set({ currentOrderId: orderId }),

    orderDetail: {} as RechargeRecordItemResult | WithdrawRecordItemResult,
    setOrderDetail: (orderDetail) => set({ orderDetail }),
  }));
