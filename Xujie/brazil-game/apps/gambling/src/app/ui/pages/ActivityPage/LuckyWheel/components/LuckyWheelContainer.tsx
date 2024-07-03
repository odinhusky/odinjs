import cx from 'apps/gambling/src/app/ui/utils/cx';
import { environment } from 'apps/gambling/src/environments/environment';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import { useEffect, useState } from 'react';
import { SwitchWheelBtnType } from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelConfigTransform';
import LuckyWheelSwitchWheelBtns from './LuckyWheelSwitchWheelBtns';
import { isEmpty } from 'lodash';
import { WheelConfigsType } from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelConfigTransform';
import { LevelType } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/PostLuckyWheelSpinEndpoint';
import LuckyWheelBody from './LuckyWheelBody';

interface LuckyWheelContainerProps {
  switchWheelBtns?: SwitchWheelBtnType[];
  wheelConfigs?: WheelConfigsType[];
  currentLuckyValue?: number;
}

export const LuckyWheelContainer = ({
  switchWheelBtns,
  wheelConfigs,
  currentLuckyValue,
}: LuckyWheelContainerProps) => {
  const [activeLevel, setActiveLevel] = useState<LevelType>(() => {
    if (switchWheelBtns && !isEmpty(switchWheelBtns))
      return switchWheelBtns[0].level as LevelType;

    return 'Silver';
  });

  const [activePerSpinCost, setActivePerSpinCost] = useState<number>(() => {
    if (switchWheelBtns && !isEmpty(switchWheelBtns))
      return switchWheelBtns[0].perSpinCost as number;

    return 0;
  });

  useEffect(() => {
    if (switchWheelBtns && !isEmpty(switchWheelBtns) && activeLevel) {
      const currentBtn = switchWheelBtns.find(
        (item) => item.level === activeLevel
      );

      setActivePerSpinCost(currentBtn?.perSpinCost as number);
    }
  }, [switchWheelBtns, activeLevel]);

  const { isTablet, isDesktop } = useBreakpoint();
  const bgImage = isDesktop
    ? `url("assets/${environment.uVersion}/bg_fortune_wheel.png")`
    : isTablet
    ? `url("assets/${environment.uVersion}/bg_fortune_wheel_t.png")`
    : `url("assets/${environment.uVersion}/bg_fortune_wheel_m.png")`;

  return (
    <div
      className={cx(
        'relative',
        'w-full',
        // 'min-h-[452px] tab:min-h-[552px]',
        'rounded-lg',
        'bg-center bg-no-repeat bg-cover',
        'px-[10px] pt-6',
        'overflow-hidden',
        {
          'pb-6': environment.uVersion === 'u1',
          'pb-3 tab:pb-[32px] tablet:pb-[24px] px-4 tab:px-9':
            environment.uVersion === 'u6',
        }
      )}
      style={{
        backgroundImage: bgImage,
      }}
    >
      {/* 輪盤部分 */}
      <LuckyWheelBody
        activeLevel={activeLevel}
        activePerSpinCost={activePerSpinCost}
        wheelConfigs={wheelConfigs}
        currentLuckyValue={currentLuckyValue}
      />

      {/* 切換按鈕部分 */}
      <LuckyWheelSwitchWheelBtns
        switchWheelBtns={switchWheelBtns}
        activeLevel={activeLevel}
        setActiveLevel={setActiveLevel}
      />
    </div>
  );
};

export default LuckyWheelContainer;
