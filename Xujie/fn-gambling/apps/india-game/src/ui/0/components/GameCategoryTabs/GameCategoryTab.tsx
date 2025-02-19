import { HallPageTab } from '@libs/mode2/zustand/page/hallPageStore';
import { forwardRef } from 'react';

interface GameCategoryTabProps {
  item: HallPageTab;
  index: number;
}

export const GameCategoryTab = forwardRef<HTMLDivElement, GameCategoryTabProps>(
  ({ item, index }, ref) => {
    return <div ref={ref}></div>;
  }
);

export default GameCategoryTab;
