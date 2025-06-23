import { GameListItemResult } from '@libs/mode2/zustand/page/hallPageStore';

export interface GameItemProps {
  item: GameListItemResult;
  showGameName: boolean; // 整個game list 的item是否要顯示name
  isShowHoverMask: boolean;
  imageClassName?: string;
}
