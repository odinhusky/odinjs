import { create } from 'zustand';
import { ServicesTypeResult } from '@mode2API/endpoint/user/PostHomeEndpoint';

export interface FloatActionButtonConfig {
  isFeatureSupport: boolean; // 開啟浮動按鈕功能
  isPermanentDisplay: boolean; // 是否常駐顯示
  isDraggable: boolean; // 是否可拖曳
  isDrawerStyle: boolean; // 是否為抽屜樣式
  isShowRechargeWheelBtn: boolean; //是否顯示活動按鈕
  isShowMoneyBoxBtn: boolean; //是否顯示存錢罐通知按鈕
  displayIcons: (ServicesTypeResult | string)[]; // 顯示哪些浮動按鈕
}

export interface FloatActionButton {
  label: string;
  type: ServicesTypeResult | string;
  icon: string;
  isShowRedDot?: boolean;
  onActionClick: () => void;
  className?: string;
}

interface FloatActionButtonListStoreTypes {
  fabConfig: FloatActionButtonConfig;
  setFabConfig: (config: FloatActionButtonConfig) => void;
  resetConfig: () => void;
  isOpen: boolean;
  toggleFABDrawer: () => void;
  fabList: FloatActionButton[];
  setFabList: (list: FloatActionButton[]) => void;
  isShowDrawerControlBar: boolean;
  setShowDrawerControlBar: (isShowDrawerControlBar: boolean) => void;
  isOpenDrawer: boolean; // 特定頁面常駐開啟
  setOpenDrawer: (isOpenDrawer: boolean) => void;
}

const defaultConfig: FloatActionButtonConfig = {
  isFeatureSupport: false,
  isPermanentDisplay: false,
  isDraggable: false,
  isDrawerStyle: false,
  isShowRechargeWheelBtn: false,
  isShowMoneyBoxBtn: false,
  displayIcons: [],
};

export const useFloatActionButtonListStore =
  create<FloatActionButtonListStoreTypes>((set) => ({
    fabConfig: defaultConfig,
    setFabConfig: (config) => set(() => ({ fabConfig: config })),
    resetConfig: () => set(() => ({ fabConfig: defaultConfig })),
    isOpen: true,
    toggleFABDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
    fabList: [],
    setFabList: (list) => set(() => ({ fabList: list })),
    isShowDrawerControlBar: false,
    setShowDrawerControlBar: (isShowDrawerControlBar) =>
      set(() => ({ isShowDrawerControlBar: isShowDrawerControlBar })),
    isOpenDrawer: true,
    setOpenDrawer: (isOpenDrawer) =>
      set(() => ({ isOpenDrawer: isOpenDrawer })),
  }));
