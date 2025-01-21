import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';
import { I18NContent } from '@libs/mode2/@types/i18nType';

export enum EHeaderType {
  Main = 'main',
  MoreGame = 'moreGame',
  GameSel = 'gameSel',
  GameWeb = 'gameWeb',
  Common = 'common',
  Null = 'null',
}

export interface IConfig {
  type: `${EHeaderType}`;
  title?: I18NContent;
  onBack?: () => void;
  // overwrite Recharge click
  onSystemLogoClick?: () => void;
  onDepositClick?: () => void;
}

export const useHeaderStore = create<{
  config: IConfig;
  setConfig: (config: IConfig) => void;
}>()(
  devtoolsAndPersistWrapper('[component store] useHeaderStore', (set) => ({
    config: { type: 'main' } as IConfig,
    setConfig: (config: IConfig) => set(() => ({ config })),
  }))
);
