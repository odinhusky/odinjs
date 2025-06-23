import { forwardRef, Ref } from 'react';

const BottomNavigation = forwardRef((_, ref: Ref<HTMLDivElement>) => {
  return <div ref={ref}></div>;
});

export default BottomNavigation;
