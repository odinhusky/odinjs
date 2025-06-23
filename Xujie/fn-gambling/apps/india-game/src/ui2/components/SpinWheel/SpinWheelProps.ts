import { FixPartClassNameObj } from './components/SpinWheelFixdPart';
import React from 'react';

import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { WheelSegmentResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { CustomFixedPartNodeFnParams } from './2/components/SpinWheelFixdPart';

export type WheelCategory = 'recharge' | 'invite';

export interface SpinWheelProps {
  category: WheelCategory;
  type?: RechargeWheelType;
  isAnimating: boolean;
  handleClickTrigger: VoidFunction;
  className?: string;
  dynamicRechargeRouletteClass?: string;
  dynamicInviteRouletteClass?: string;
  spinPartClassNameObj?: SpinWheelSpinPartClassNameObj;
  fixPartClassNameObj?: FixPartClassNameObj;
  extraPointerRender?: () => React.ReactNode | null;
  wheelSegments: WheelSegmentResult[];
  remainSpin?: number;
  remindFreeSpin?: number;
  customBtnNodeFn?: (
    remainSpin: number,
    buttonType: RechargeWheelType
  ) => React.ReactNode;
  customFixedPartNodeFn?: (
    params: CustomFixedPartNodeFnParams
  ) => React.ReactNode;
}

export interface SpinWheelSpinPartClassNameObj {
  container?: string;
  surface?: string;
  rewardTitleClass?: string;
  rewardImageClass?: string;
  rechargeRewardClass?: string;
  rechargeIsMoneyRewardClass?: string;
  rechargeNotMoneyRewardClass?: string;
  inviteRewardClass?: string;
  inviteIsMoneyRewardClass?: string;
  inviteNotMoneyRewardClass?: string;
  rewardImagesClass?: string;
  inviteRewardImagesClass?: string;
  rechargeRewardImagesClass?: string;
  rouletteRotateOffset?: number;
}

export interface SpinWheelSpinPartProps {
  category: WheelCategory;
  wheelBgImgName: string;
  wheelSegments: WheelSegmentResult[];
  spinPartClassNameObj?: SpinWheelSpinPartClassNameObj;
  rouletteClass: string;
}
