import { cx } from '@libs/commonUtils';
import { DEFAULT_BG, XY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpinWheelRechargeButton from '../SpinWheelRechargeButton';
import SpinWheelInviteButton from '../SpinWheelInviteButton';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import { WheelCategory } from '@components/SpinWheel';
import { DEFAULT_DEBOUNCE_DELAY } from '@libs/constant/functionParams';

export interface FixPartClassNameObj {
  container?: string;
  frame?: string;
  button?: string;
  buttonText?: string;
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
  const buttonBgImg = getImgUrl(EResourceLevel.V, imgNames.button);
  const handleSpinWheel = useDebounceAction(onClickTrigger, debounceTimer);

  return (
    <div
      className={cx(
        rouletteClass,
        'absolute top-0 left-0',
        fixPartClassNameObj?.container
      )}
    >
      {/* 輪盤外框 */}
      <img
        src={getImgUrl(EResourceLevel.V, imgNames.frame)}
        alt="Wheel frame image"
        className={cx(
          rouletteClass,
          'absolute top-0 left-0',
          '!h-auto',
          fixPartClassNameObj?.frame
        )}
      />

      {/* 點選轉動的按鈕 */}
      <button
        className={cx(
          {
            'w-[75px] h-[75px]': category === 'recharge',
            'w-20 h-20': category === 'invite',
          },
          'absolute z-[1]',
          XY_CENTER,
          'top-[50%]',
          DEFAULT_BG,
          fixPartClassNameObj?.button
        )}
        style={{
          backgroundImage: `url(${buttonBgImg})`,
        }}
        onClick={isAnimating ? () => {} : handleSpinWheel}
      >
        {category === 'recharge' ? (
          <SpinWheelRechargeButton
            buttonType={buttonInfo?.buttonType || 'silver'}
            remainSpin={buttonInfo.remainSpin}
          />
        ) : (
          <SpinWheelInviteButton
            isFreeSpin={buttonInfo?.isFreeSpin || false}
            remainSpin={buttonInfo.remainSpin}
          />
        )}
      </button>
    </div>
  );
};

export default SpinWheelFixedPart;
