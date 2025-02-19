import { memo } from 'react';
import { GameListItemResult } from '@mode2/zustand/page/hallPageStore';
import isEqual from 'lodash/isEqual';

interface GameItemProps {
  item: GameListItemResult;
  showGameName: boolean; // 整個game list 的item是否要顯示name
  isShowHoverMask: boolean;
  imageClassName?: string;
}

/**
 * 遊戲圖片失效的浮水印
 */
const LoadErrorWatermark = memo(
  (props: { isDisplay: boolean; displayName: string; isMaintain: boolean }) => {
    return null;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps, nextProps);
  }
);

export const GameItem = memo((props: GameItemProps) => {
  return null;
});

export default GameItem;
