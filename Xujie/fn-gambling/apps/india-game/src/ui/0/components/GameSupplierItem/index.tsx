import { memo } from 'react';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';

interface GameItemProps {
  item: GameListItemResult;
}

/** 遊戲供應商Item */
export const GameSupplierItem = memo((props: GameItemProps) => {
  return null;
});

export default GameSupplierItem;
