import { cx } from '@libs/commonUtils';
import { DEFAULT_BG, XY_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import SpinWheelRechargeButton from '../SpinWheelRechargeButton';
import SpinWheelInviteButton from '../SpinWheelInviteButton';
import { RechargeWheelType } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import { DEFAULT_DEBOUNCE_DELAY } from '@libs/constant/functionParams';
import { WheelCategory } from '@components/SpinWheel/SpinWheelProps';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

export interface FixPartClassNameObj {
  container?: string;
  frame?: string;
  button?: string;
  buttonSpinClass?: string;
  buttonTextClass?: string;
}

interface ButtonInfoTypes {
  buttonType?: RechargeWheelType;
  remainSpin: number;
  isFreeSpin?: boolean;
}

export interface CustomFixedPartNodeFnParams {
  category: WheelCategory;
  buttonInfo: ButtonInfoTypes;
}

interface SpinWheelFixedPartProps {
  category: WheelCategory;
  imgNames: {
    frame: string;
    button: string;
  };
  buttonInfo: ButtonInfoTypes;
  isAnimating: boolean;
  onClickTrigger: VoidFunction;
  debounceTimer?: number;
  fixPartClassNameObj?: FixPartClassNameObj;
  rouletteClass: string;
  customBtnNodeFn?: (
    remainSpin: number,
    buttonType: RechargeWheelType
  ) => React.ReactNode;
  customFixedPartNodeFn?: (
    params: CustomFixedPartNodeFnParams
  ) => React.ReactNode;
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
  customBtnNodeFn,
  customFixedPartNodeFn,
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
      <BaseCacheImg
        src={getImgUrl(EResourceLevel.V, imgNames.frame)}
        imgName={imgNames.frame}
        alt="Wheel frame image"
        className={cx(
          rouletteClass,
          'absolute top-0 left-0 z-[2]',
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
          'absolute z-[3]',
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
            customBtnNodeFn={customBtnNodeFn}
          />
        ) : (
          <SpinWheelInviteButton
            isFreeSpin={buttonInfo?.isFreeSpin || false}
            remainSpin={buttonInfo.remainSpin}
            buttonSpinClass={fixPartClassNameObj?.buttonSpinClass}
            buttonTextClass={fixPartClassNameObj?.buttonTextClass}
          />
        )}
      </button>

      {/* 其他 fixedPart 可以傳入客製化內容 */}
      {customFixedPartNodeFn instanceof Function
        ? customFixedPartNodeFn({
            category,
            buttonInfo,
          })
        : null}
    </div>
  );
};

export default SpinWheelFixedPart;
