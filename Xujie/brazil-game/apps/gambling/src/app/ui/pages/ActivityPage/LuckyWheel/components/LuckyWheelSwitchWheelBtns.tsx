import { LevelType } from 'apps/gambling/src/app/external/endpoint/activity/luckyWheel/PostLuckyWheelSpinEndpoint';
import { SwitchWheelBtnType } from 'apps/gambling/src/app/external/transform/activity/luckyWheel/useLuckyWheelConfigTransform';
import cx from 'apps/gambling/src/app/ui/utils/cx';
import t from 'apps/gambling/src/assets/constant/lang';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';
import { isEmpty } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import { formatIntLocaleMoney } from '../../../../utils/format';
import { environment } from 'apps/gambling/src/environments/environment';
import { useLuckyWheelCtx } from '../LuckyWheelContext';

interface LuckyWheelSwitchWheelBtnsProps {
  switchWheelBtns?: SwitchWheelBtnType[];
  activeLevel: LevelType;
  setActiveLevel: Dispatch<SetStateAction<LevelType>>;
}

export const LuckyWheelSwitchWheelBtns = ({
  activeLevel,
  setActiveLevel,
  switchWheelBtns,
}: LuckyWheelSwitchWheelBtnsProps) => {
  const { isAnimatingObj } = useLuckyWheelCtx();
  const isAnyWheelAnimating = Object.values(isAnimatingObj).includes(true);

  // = styles
  const perSpinCostTextClass = cx(
    'block',
    'break-normal font-medium',
    'text-[10px] leading-4',
    'tab:text-sm tab:leading-5'
  );

  const U6ButtonClass = cx(
    'px-2 tab:px-5',
    'py-1 tab:py-2',
    'tablet:max-w-[190px]'
  );

  const U6BtnSpanClass = (isActive: boolean) =>
    cx(
      'w-full',
      'border-b',
      `${
        isActive && environment.uVersion === 'u6'
          ? 'border-white'
          : 'border-[var(--grayscale-80)]'
      }`,
      'mb-1'
    );

  return (
    <div
      className={cx(
        'relative z-[4]',
        'w-full',
        'mx-auto mt-8',
        FLEX_CENTER,
        'gap-2 tab:gap-5'
      )}
    >
      {!isEmpty(switchWheelBtns)
        ? switchWheelBtns?.map((item) => {
            const isActive = activeLevel === item.level;
            return (
              <button
                key={item.id}
                className={cx(
                  `${
                    isActive
                      ? 'lucky-wheel-primary-btn'
                      : 'lucky-wheel-primary-btn-disabled'
                  }`,
                  FLEX_CENTER,
                  'flex-col',
                  'flex-1 h-[72px]',
                  'px-1 py-2',
                  `${environment.uVersion === 'u6' ? U6ButtonClass : ''}`
                )}
                onClick={() => {
                  if (isAnyWheelAnimating) return;
                  setActiveLevel(item.level as LevelType);
                }}
              >
                <span
                  className={cx(
                    'block',
                    'font-bold',
                    'text-sm leading-5',
                    'text-base leading-6',
                    `${
                      environment.uVersion === 'u6'
                        ? U6BtnSpanClass(isActive)
                        : ''
                    }`
                  )}
                >
                  {t[item.level || 'Silver']}
                </span>

                <div
                  className={cx(
                    'w-full',
                    'items-center justify-center gap-1',
                    'block fold:flex'
                  )}
                >
                  <span className={perSpinCostTextClass}>
                    {formatIntLocaleMoney(item.perSpinCost || 0)}
                  </span>

                  <span className={perSpinCostTextClass}>
                    {t['perSpinCostText']}
                  </span>
                </div>
              </button>
            );
          })
        : null}
    </div>
  );
};

export default LuckyWheelSwitchWheelBtns;
