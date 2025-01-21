import ProgressAnchors, {
  ProgressAnchorsObj,
} from '@components/ProgressAnchors';
import { cx } from '@libs/commonUtils';
import { AnchorPointResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelConfigEndpoint';
import { formatMoney } from '@libs/mode2/utils';
import { useRechargeWheelTabStore } from '@libs/mode2/zustand/components/rechargeWheelTabStore';
import useMode2RechargeWheelPageStore, {
  defaultAnchorPointList,
} from '@libs/mode2/zustand/page/rechargeWheelPage';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface RechargeWheelProgressAnchorsProps {}

export const RechargeWheelProgressAnchors =
  ({}: RechargeWheelProgressAnchorsProps) => {
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
        render: ({ isAchieve, data }) => {
          return (
            <div className="text-center">
              <span
                className={cx(
                  'block',
                  'text-xs',
                  isAchieve
                    ? 'bgi-text-[var(--grayscale-100)]'
                    : 'bgi-text-[var(--grayscale-70)]'
                )}
              >
                {formatMoney(data.requiredReward)}
              </span>

              {data.receiveSpin > 0 ? (
                <span
                  className={cx(
                    'block',
                    'bgi-text-[var(--grayscale-100)]',
                    'text-xs',
                    'min-w-[50px]'
                  )}
                  style={{
                    textShadow: 'var(--text-shadow-light-orange)',
                  }}
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
        }}
        percent={percentage}
        anchors={anchors}
      />
    );
  };

export default RechargeWheelProgressAnchors;
