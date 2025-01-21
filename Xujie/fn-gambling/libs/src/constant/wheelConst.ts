import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';

export const SPIN_ANIMATION_TOTAL_TIME = 3000;

export const BASE_ROTATE_DEG = 7200;
export const CIRCLE_DEG = 360;
export const RECHARGE_ZONE_NUMBER = 8;
export const RECHARGE_ZONE_DEG = CIRCLE_DEG / RECHARGE_ZONE_NUMBER;

export const RECHARGE_ZONE_DEG_OFFSET = RECHARGE_ZONE_DEG / 2;

export const LOOP_ANIMATION_OPTIONS = {
  // fill: 'forward',
  duration: SPIN_ANIMATION_TOTAL_TIME,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
};

export const RECHARGE_TAB_NAMES: RechargeWheelType[] = [
  'silver',
  'gold',
  'diamond',
  'supreme',
];
