import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { DEFAULT_DEBOUNCE_DELAY } from '@libs/constant/functionParams';
import { WheelCategory } from '@components/SpinWheel/SpinWheelProps';

export interface FixPartClassNameObj {
  container?: string;
  frame?: string;
  button?: string;
  buttonSpinClass?: string;
  buttonText?: string;
  buttonTextClass?: string;
}

interface SpinWheelFixedPartProps {
  category: WheelCategory;
  imgNames: {
    frame: string;
    button: string;
  };
  buttonInfo: {
    buttonType?: RechargeWheelType;
    remainSpin: number;
    isFreeSpin?: boolean;
  };
  isAnimating: boolean;
  onClickTrigger: VoidFunction;
  debounceTimer?: number;
  fixPartClassNameObj?: FixPartClassNameObj;
  rouletteClass: string;
}

export const SpinWheelFixedPart = ({
  category,
  imgNames,
  buttonInfo,
  isAnimating,
  onClickTrigger,
  debounceTimer = DEFAULT_DEBOUNCE_DELAY,
  fixPartClassNameObj,
  rouletteClass,
}: SpinWheelFixedPartProps) => {
  return null;
};

export default SpinWheelFixedPart;
