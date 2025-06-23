import {
  handleTeamClubWithDrawClaimButtonClick,
  handleTeamClubWithDrawDetailButtonClick,
} from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseTertiaryBtn from '@components/BaseSecondaryBtn';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import { formatMoney } from '@libs/mode2/utils';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import { useTranslation } from 'react-i18next';

export const TeamClubWithdrawRewards = () => {
  const { handleTeamClubClick } = useTeamClubAction();
  const { t } = useTranslation();

  const isClaimable = useTeamClubWithDrawStore((state) => state.isClaimable);
  const rewards = useTeamClubWithDrawStore((state) => state.rewards);
  const todayReward = useTeamClubWithDrawStore((state) => state.todayReward);
  const totalReward = useTeamClubWithDrawStore((state) => state.totalReward);

  const handleClaimBtnClick = useDebounceAction(() => {
    handleTeamClubClick({
      actionName: handleTeamClubWithDrawClaimButtonClick,
    });
  }, 1000);

  return (
    <div
      className={cx(
        FLEX_COL,
        'border bgi-border-[var(--base-1-light)]  bgi-[var(--linear-1)] after-rounded-lg rounded-lg'
      )}
    >
      <div
        className={cx(
          'bgi-[var(--linear-4)]',
          'p-2',
          FLEX_ITEMS_CENTER,
          'rounded-t-lg'
        )}
      >
        <div className={cx('w-full', FLEX_COL, 'gap-1')}>
          <h4 className={cx('mr-auto block', 'text-sm')}>
            {t('earn_my_rewards_withdraw_title')}
          </h4>

          <div
            className={cx(
              'bgi-text-[var(--linear-2)]',
              'text-2xl',
              'font-bold'
            )}
          >
            {formatMoney({ value: rewards })}
          </div>
        </div>

        <div
          className={cx(
            'controll-btns',
            FLEX_ITEMS_CENTER,
            'gap-2',
            'relative z-[1]'
          )}
        >
          <BaseTertiaryBtn
            className={cx('min-w-[71px] h-7', 'px-3 py-1')}
            disabled={!isClaimable}
            children={
              <span className={cx('text-sm')}>
                {t('earn_my_rewards_withdraw_claim')}
              </span>
            }
            onClick={handleClaimBtnClick}
          />

          <BasePrimaryBtn
            className={cx('min-w-[71px] h-7', 'px-3 py-1')}
            onClick={() => {
              handleTeamClubClick({
                actionName: handleTeamClubWithDrawDetailButtonClick,
              });
            }}
            children={
              <span className={cx('text-sm')}>
                {t('earn_my_rewards_withdrwa_detail')}
              </span>
            }
          />
        </div>
      </div>

      <div
        className={cx(
          FLEX_ITEMS_CENTER,
          'justify-around',
          'p-2',
          'bgi-[var(--linear-1)]',
          'rounded-b-lg'
        )}
      >
        <div className={cx(FLEX_CENTER, 'flex-col', 'rounded')}>
          <span
            className={cx('bgi-text-[var(--transparent-white-70)]', 'text-xs')}
          >
            {t('earn_my_rewards_withdrwa_total_rewards')}
          </span>
          <span
            className={cx(
              'bgi-text-[var(--linear-2)]',
              'text-xl font-semibold'
            )}
          >
            {formatMoney({ value: totalReward })}
          </span>
        </div>

        {/* 分隔線 */}
        <div
          className={cx('w-px h-8', 'bgi-[var(--transparent-white-10)]')}
        ></div>

        <div className={cx(FLEX_CENTER, 'flex-col', 'rounded')}>
          <span
            className={cx('bgi-text-[var(--transparent-white-70)]', 'text-xs')}
          >
            {t('earn_my_rewards_withdrwa_todays_rewards')}
          </span>
          <span
            className={cx(
              'bgi-text-[var(--linear-2)]',
              'text-xl font-semibold'
            )}
          >
            {formatMoney({ value: todayReward })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamClubWithdrawRewards;
