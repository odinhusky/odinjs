import { create } from 'zustand';

export enum OrderDeatilRecordStatus {
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAIL = 'FAIL',
  FAIL_EXPIRED = 'FAIL_EXPIRED',
}

export type TOrderDetailTabUnitValue = 1 | 7 | 30;

export interface IOrderDetailTabUnit {
  label: string;
  value: TOrderDetailTabUnitValue;
}

export interface IOrderDetailListType {
  amount: number;
  orderNumber: string;
  status: OrderDeatilRecordStatus;
  timestamp: number;
}

export enum EOrderDetailPageType {
  RECHARGE = 'recharge',
  WITHDRAW = 'withdraw',
}

export type TOrderDetailPageType = `${EOrderDetailPageType}`;

interface useMode2OrderDetailPageType {
  orderDetailPageType: TOrderDetailPageType;
  setOrderDetailPageType: (index: TOrderDetailPageType) => void;
  orderDetailTabIndex: TOrderDetailTabUnitValue;
  setOrderDetailTabIndex: (index: TOrderDetailTabUnitValue) => void;
  orderDetailTabList: IOrderDetailTabUnit[];
  setOrderDetailTabList: (value: IOrderDetailTabUnit[]) => void;
  orderDetailList: IOrderDetailListType[];
  setOrderDetailList: (orderDetailList: IOrderDetailListType[]) => void;
}

export const useMode2OrderDetailPageStore =
  create<useMode2OrderDetailPageType>()((set) => ({
    orderDetailList: [] as IOrderDetailListType[],
    setOrderDetailList: (value) => set({ orderDetailList: value }),
    orderDetailTabIndex: 1,
    setOrderDetailTabIndex: (value) => set({ orderDetailTabIndex: value }),
    orderDetailPageType: 'recharge',
    setOrderDetailPageType: (value) => set({ orderDetailPageType: value }),
    orderDetailTabList: [],
    setOrderDetailTabList: (value) => set({ orderDetailTabList: value }),
  }));
