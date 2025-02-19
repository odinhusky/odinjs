import { memo } from 'react';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';

interface GameItemProps {
  item: GameListItemResult;
  showGameName: boolean; // 整個game list 的item是否要顯示name
  isShowHoverMask: boolean;
  imageClassName?: string;
}

/** casino遊戲圖片失效時要顯示的遊戲廠商logo */
const GameSupplierLogo = ({ logoSrc }: { logoSrc: string }) => {
  return null;
};

export const GameItemLandscape = memo((props: GameItemProps) => {
  return null;
});

export default GameItemLandscape;
