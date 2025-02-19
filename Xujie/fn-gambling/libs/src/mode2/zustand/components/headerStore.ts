import { create } from 'zustand';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import React from 'react';

export enum EHeaderType {
  Main = 'main',
  MoreGame = 'moreGame',
  GameSel = 'gameSel',
  GameWeb = 'gameWeb',
  Common = 'common',
  Null = 'null',

  // MobileExclusive for v6
  CenterTitle = 'centerTitle',
  Empty = 'Empty',
}

export interface IConfig {
  type: `${EHeaderType}`;
  title?: I18NContent;
  onBack?: () => void;
  // overwrite Recharge click
  onSystemLogoClick?: () => void;
  onDepositClick?: () => void;
  render?: () => React.ReactNode | null;
  headerBgColor?: string;
}

export const useHeaderStore = create<{
  config: IConfig;
  setConfig: (config: IConfig) => void;
}>()((set) => ({
  config: { type: 'main' } as IConfig,
  setConfig: (config: IConfig) => set(() => ({ config })),
}));
