import { forwardRef, memo, Ref } from 'react';

const BottomNavigation = memo(
  forwardRef((_, ref: Ref<HTMLDivElement>) => {
    return <div ref={ref}></div>;
  })
);

export default BottomNavigation;
