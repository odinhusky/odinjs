import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { CSSProperties, forwardRef } from 'react';
import { MarqueeProps } from 'react-fast-marquee';

interface MarqueeScrollProps {
  icon?: React.ReactNode;
  iconColor?: string;
  iconClass?: string;
  containerClass?: string;
  marqueeContainerClass?: string;
  marqueeClass?: string;
  marqueeUnitStyle?: CSSProperties;
  marqueeUnitClass?: string;
  marqueeList: {
    id: string | number;
    broadcastText: string;
    action?: VoidAction;
  }[];
  marqueeProps?: Omit<MarqueeProps, 'className'>;
  hasDefaultStyle?: boolean;
}

export const MarqueeScroll = forwardRef<HTMLDivElement, MarqueeScrollProps>(
  (
    {
      icon,
      iconColor,
      iconClass,
      containerClass,
      marqueeContainerClass,
      marqueeClass,
      marqueeList,
      marqueeUnitClass,
      marqueeUnitStyle,
      marqueeProps,
      hasDefaultStyle = true,
    },
    ref
  ) => {
    return <div ref={ref}></div>;
  }
);

export default MarqueeScroll;
