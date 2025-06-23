import Icon from '@components/Icon';
import ProgressAnchors from '@components/ProgressAnchors';
import { ProgressAnchorsObj } from '@components/ProgressAnchors/ProgressAnchorsProps';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { AnchorPointResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { formatMoney } from '@libs/mode2/utils';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore, {
  defaultAnchorPointList,
} from '@libs/mode2/zustand/page/rechargeWheelPage';
import get from 'lodash/get';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RechargeWheelProgressAnchorsProps {}

export const RechargeWheelProgressAnchors = (
  props: RechargeWheelProgressAnchorsProps
) => {
  const { t } = useTranslation();

  const [percentage, setPercentage] = useState<number>(0);

  const activeRechargeActiveTab = useRechargeWheelTabStore(
    (state) => state.activeRechargeActiveTab
  );

  const currentDeposit = useMode2RechargeWheelPageStore(
    (state) => state.currentDeposit
  );

  const progressConfigObj = useMode2RechargeWheelPageStore(
    (state) => state.progressConfigObj
  );

  const setIsShowDepositInfo = useMode2RechargeWheelPageStore(
    (state) => state.setIsShowDepositInfo
  );

  const thisProgressObj = progressConfigObj[activeRechargeActiveTab];
  const thisMaxRequiredReward = get(thisProgressObj, 'maxRequiredReward', 0);
  const thisAnchorPointList = get(
    thisProgressObj,
    'anchorPointList',
    defaultAnchorPointList
  );

  // 計算出來正確的 percent
  const percent =
    currentDeposit > thisMaxRequiredReward
      ? 100
      : Math.floor((currentDeposit / thisMaxRequiredReward) * 100);

  const thisTotalAnchorList: number[] = thisAnchorPointList.map((item) =>
    Math.floor((item.requiredReward / thisMaxRequiredReward) * 100)
  );

  const anchors: ProgressAnchorsObj<undefined, AnchorPointResult> = {
    // totalAnchorList 是當下每個錨點的百分比是多少
    totalAnchorList: thisTotalAnchorList,
    bottom: {
      dataList: thisProgressObj?.anchorPointList || [],
      classNameObj: {
        otherItemClass: 'translate-x-[-1.3rem]',
        lastItemClass: 'translate-x-[-50%]',
      },
      render: ({ isAchieve, data, index }) => {
        return (
          <div className={cx('text-center', FLEX_COL, 'items-center')}>
            <Icon
              name="ic_spin"
              className={cx('w-[28px] h-[28px]', 'block', {
                'opacity-0': index === 0,
              })}
            />

            <span
              className={cx(
                'block',
                'text-sm',
                'bgi-text-[var(--grayscale-100)]'
              )}
            >
              {formatMoney({ value: data.requiredReward })}
            </span>

            {data.receiveSpin > 0 ? (
              <span
                className={cx(
                  'block',
                  isAchieve
                    ? 'bgi-text-[var(--base-1-main)]'
                    : 'bgi-text-[var(--base-2-variant1)]',
                  'text-sm font-bold',
                  'min-w-[60px]',
                  'bgi-text-border-[var(--grayscale-00),2px]'
                )}
                // 使用 bgi-text-border 的 class 一定要將要顯示的文字傳到 data-stroke 中
                data-stroke={t('deposit_wheel_get_spin', {
                  receiveSpin: data.receiveSpin,
                  count: data.receiveSpin,
                })}
              >
                {t('deposit_wheel_get_spin', {
                  receiveSpin: data.receiveSpin,
                  count: data.receiveSpin,
                })}
              </span>
            ) : null}
          </div>
        );
      },
    },
  };

  // 為了每次切換 tab 的時候進度條都從左開始動畫，先設定為0 500 豪秒後才切換到正確的比例
  useEffect(() => {
    setPercentage(0);
    const x = setTimeout(() => {
      setPercentage(percent);
      setIsShowDepositInfo(percent < 100);
    }, 500);

    return () => {
      clearTimeout(x);
    };
  }, [activeRechargeActiveTab, percent]);

  return (
    <ProgressAnchors
      baseProgressClassObj={{
        strokeClass: cx({
          'transition-none': percentage === 0,
        }),
        trailClass: cx(
          'border bgi-border-[var(--base-2-variant2)] bg-shadow-[var(--recharge-wheel-progress-inset-shadow)]'
        ),
        containerClass: cx('relative', 'w-[calc(100%-30px)]', 'pl-4'),
      }}
      customAnchorNode={(isAchieve) => (
        <Icon
          name={`ic_progress_bar_mark${isAchieve ? '_active' : ''}`}
          className={cx('w-5 h-5')}
        />
      )}
      anchorListClassObj={{
        achieveAnchorClass: '',
        unAchieveAnchorClass: '',
        firstAnchorClass: cx('translate-x-[calc(-0.625rem)]'),
        lastAnchorClass: cx('-translate-x-[calc(100%-0.53rem)]'),
        otherAnchorClass: cx('translate-x-[calc(0)]'),
      }}
      progressStrokeColor="var(--base-1-variant3)"
      progressTrailColor="var(--base-2-variant4)"
      size={20}
      percent={percentage}
      anchors={anchors}
      isShowZeroAnchor={false}
    />
  );
};

export default RechargeWheelProgressAnchors;
