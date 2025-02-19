import NoData from '@components/NoData';
import cx from '@libs/commonUtils/cx';
import { WheelSpinHistoryResult } from '@libs/mode2/external/api/endpoint/wheel/PostWheelPlayerSpinHistoryListEndpoint';
import { formatDate, formatMoney } from '@libs/mode2/utils';
import { useActivityRecordPageStore } from '@libs/mode2/zustand/page/activityRecordPageStore';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useRechargeWheelRewardsRecordBase from '@mode2/usecase/page/activityRecordPage/useRechargeWheelRewardsRecordBase';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';
import AffixHeaderBottomWrapper from '@mode2/components/AffixHeaderBottomWrapper';
import { Icon } from '@components/Icon';
import { RechargeWheelLevelType } from '@mode2/@types/rechargeWheelLevelTypes';

const TotalRewardTab = () => {
  const totalRewards = useActivityRecordPageStore(
    (state) => state.totalRewards
  );
  return (
    <AffixHeaderBottomWrapper
      affixContainerClass={'mt-0'}
      notAffixContainerClass={'mt-3'}
    >
      <div className=" bgi-[var(--base-2-variant6)] px-7 py-1.6">
        <p className="bgi-text-[var(--base-2-variant2)]">
          <Trans
            i18nKey={'earn_my_rewards_withdrwa_total_rewards'}
            values={{ rewards: formatMoney(totalRewards, true) }}
            components={{
              rewardsTab: <span className="bgi-text-[var(--base-1-main)]" />,
            }}
          />
        </p>
      </div>
    </AffixHeaderBottomWrapper>
  );
};

const mappingWheelNameKey: Record<RechargeWheelLevelType, string> = {
  [RechargeWheelLevelType.TIER_SILVER]: 'deposit_wheel_my_rewards_silver_wheel',
  [RechargeWheelLevelType.TIER_GOLD]: 'deposit_wheel_my_rewards_gold_wheel',
  [RechargeWheelLevelType.TIER_DIAMOND]:
    'deposit_wheel_my_rewards_diamond_wheel',
  [RechargeWheelLevelType.TIER_SUPREME]:
    'deposit_wheel_my_rewards_supreme_wheel',
};

const RewardList = ({ list }: { list: WheelSpinHistoryResult[] }) => {
  const { t } = useTranslation();
  return (
    <div>
      {list.map((item, index) => {
        const i18nKey: string =
          mappingWheelNameKey[item.wheelLevel] ||
          RechargeWheelLevelType[item.wheelLevel];
        return (
          <div
            key={`${index}_${item.createTime}`}
            className={cx(
              'flex justify-between gap-3 items-center',
              'px-7 py-4',
              'bgi-border-b-[var(--transparent-white-10)] border-b',
              'text-lg font-medium bgi-text-[var(--grayscale-100)]'
            )}
          >
            <Icon className="w-8 h-8" name={'ic_money'} />
            <div className="flex flex-1 flex-col justify-center">
              <p>{t(i18nKey)}</p>
              <p className="text-base bgi-text-[var(--base-2-variant2)]">
                {formatDate(item.createTime ?? 0)}
              </p>
            </div>
            <div className="bgi-text-[var(--base-1-main)]">
              {' '}
              {formatMoney(item.rewards, true)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const RechargeWheelRewardsRecordContent = () => {
  useRechargeWheelRewardsRecordBase();
  const { t } = useTranslation();
  const rechargeRewardRecordList = useActivityRecordPageStore(
    (state) => state.rechargeRewardRecordList
  );

  return (
    <div
      className={cx(
        'bgi-text-[var(--base-2-variant2)]',
        'text-lg',
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '!-mx-4 m-auto',
        'pb-20'
      )}
    >
      <TotalRewardTab />

      <RewardList list={rechargeRewardRecordList} />

      {rechargeRewardRecordList.length <= 0 ? (
        <div className="h-screen flex justify-center">
          <NoData text={t('spin_and_share_wheel_withdrawal_history_no_data')} />
        </div>
      ) : null}
    </div>
  );
};
export default RechargeWheelRewardsRecordContent;
