import { forwardRef, memo } from 'react';
import { GameItemProps } from './GameItemProps';

export const GameItem = memo(
  forwardRef<HTMLDivElement, GameItemProps>((props, ref) => {
    return null;
  })
);

export default GameItem;
