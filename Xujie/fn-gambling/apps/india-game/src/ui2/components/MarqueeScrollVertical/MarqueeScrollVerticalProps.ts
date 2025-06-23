import { VoidAction } from '@libs/mode2/@types/commonTypes';
import { CSSProperties } from 'react';

export interface MarqueeScrollVerticalProps {
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
  hasDefaultStyle?: boolean;
  autoplayDelay?: number;
}
