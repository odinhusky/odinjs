import { create } from 'zustand';
import { devtoolsAndPersistWrapper } from '../middlewareWrapper';

export enum SharePosterType {
  SHARETEAMCLUB = 0, // 俱樂部分享
  SHAREINVITE = 1, // 邀請分享
}

interface Poster {
  length: number;
  prefix: string;
}

export const defaultSharePosterList: { [key: number]: Poster } = {
  [SharePosterType.SHARETEAMCLUB]: {
    length: 5,
    prefix: 'share_poster_',
  },
  [SharePosterType.SHAREINVITE]: {
    length: 4,
    prefix: 'wheel_share_poster_',
  },
};

export interface Mode2SharePageStoreTypes {
  sharePosterList: string[];
  setSharePosterList: (list: string[]) => void;
  currentShareType: number;
  setCurrentShareType: (value: number) => void;
}

export const useMode2SharePageStore = create<Mode2SharePageStoreTypes>()(
  devtoolsAndPersistWrapper('[page store] useMode2SharePageStore', (set) => ({
    sharePosterList: [] as string[],
    setSharePosterList: (list) => set(() => ({ sharePosterList: list })),
    currentShareType: SharePosterType.SHARETEAMCLUB,
    setCurrentShareType: (value) => set(() => ({ currentShareType: value })),
  }))
);
