import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { CSSProperties } from 'react';
import { MarqueeProps } from 'react-fast-marquee';

export interface MarqueeScrollProps {
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
