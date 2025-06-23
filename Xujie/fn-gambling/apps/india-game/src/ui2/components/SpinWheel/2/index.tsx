import { cx } from '@libs/commonUtils';
import { FLEX_CENTER } from '@libs/constant/style';
import SpinWheelFixedPart from './components/SpinWheelFixdPart';
import SpinWheelSpinPart from './components/SpinWheelSpinPart';
import { forwardRef } from 'react';
import {
  inviteRouletteClass,
  rechargeRouletteClass,
} from '@/ui2/components/SpinWheel/rouletteStyle';
import { SpinWheelProps } from '../SpinWheelProps';

export const SpinWheel = forwardRef<HTMLDivElement, SpinWheelProps>(
  (
    {
      category = 'recharge',
      type,
      isAnimating,
      handleClickTrigger,
      className,
      dynamicRechargeRouletteClass,
      dynamicInviteRouletteClass,
      spinPartClassNameObj,
      fixPartClassNameObj,
      extraPointerRender,
      wheelSegments,
      remainSpin = 0,
      remindFreeSpin = 0,
      customBtnNodeFn,
      customFixedPartNodeFn,
    },
    ref
  ) => {
    const defaultButtonInfo = { remainSpin: remindFreeSpin + remainSpin };

    const diffButtonInfo =
      category === 'recharge'
        ? { buttonType: type }
        : { isFreeSpin: !!remindFreeSpin };

    const buttonInfo = {
      ...defaultButtonInfo,
      ...diffButtonInfo,
    };

    const prefix = category === 'invite' ? category : type;

    // const rouletteClass =
    // category === 'recharge' ? rechargeRouletteClass : inviteRouletteClass;
    const rouletteTypeClass = {
      recharge: rechargeRouletteClass + ' ' + dynamicRechargeRouletteClass,
      invite: inviteRouletteClass + ' ' + dynamicInviteRouletteClass,
    };

    const rouletteClass = rouletteTypeClass[category];

    return (
      <div
        className={cx(
          rouletteClass,
          FLEX_CENTER,
          'relative',
          'z-[5]',
          className
        )}
      >
        <SpinWheelSpinPart
          ref={ref}
          category={category}
          wheelBgImgName={`${prefix}_wheel_surface`}
          spinPartClassNameObj={spinPartClassNameObj}
          wheelSegments={wheelSegments}
          rouletteClass={rouletteClass}
        />

        {/* 額外的指針 疊層*/}
        {extraPointerRender?.()}

        <SpinWheelFixedPart
          category={category}
          imgNames={{
            frame: `${prefix}_wheel_frame`,
            button: `${prefix}_wheel_button`,
          }}
          isAnimating={isAnimating}
          buttonInfo={buttonInfo}
          onClickTrigger={handleClickTrigger}
          rouletteClass={rouletteClass}
          fixPartClassNameObj={fixPartClassNameObj}
          customBtnNodeFn={customBtnNodeFn}
          customFixedPartNodeFn={customFixedPartNodeFn}
        />
      </div>
    );
  }
);

export default SpinWheel;
