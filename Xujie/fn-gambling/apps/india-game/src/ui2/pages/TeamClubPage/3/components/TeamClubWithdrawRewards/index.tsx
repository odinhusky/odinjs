import {
  handleTeamClubWithDrawClaimButtonClick,
  handleTeamClubWithDrawDetailButtonClick,
} from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { cx, useObserverElementMetrics } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import {
  EResourceLevel,
  formatMoneyAbbrev,
  getImgUrl,
} from '@libs/mode2/utils';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import { useTranslation } from 'react-i18next';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

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

  const { elementRef: containerRef, elementMetrics: containerMetrics } =
    useObserverElementMetrics<HTMLDivElement>();

  return (
    <div className={cx('w-full', 'relative')}>
      <BaseCacheImg
        src={getImgUrl(EResourceLevel.V, 'bg_teamClub_share')}
        imgName="bg_teamClub_share"
        alt="Bottom background"
        className={cx('w-full block', 'relative z-[0]', 'object-contain')}
      />

      <div
        className={cx('absolute inset-0 z-[1]', 'p-4', FLEX_COL, 'gap-8')}
        ref={containerRef}
      >
        <div className={cx('px-4', FLEX_ITEMS_CENTER, 'rounded-t-lg')}>
          <div className={cx('w-full', FLEX_COL, 'gap-3')}>
            <h4
              className={cx(
                'mr-auto block',
                'text-base font-medium bgi-text-[var(--transparent-white-70)]'
              )}
            >
              {t('earn_my_rewards_withdraw_title')}
            </h4>

            <div
              className={cx(
                'bgi-text-[var(--base-1-variant5)]',
                'text-3xxl',
                'font-bold'
              )}
            >
              {formatMoneyAbbrev({
                value: rewards,
              })}
            </div>
          </div>

          <div
            className={cx(
              'controll-btns',
              'self-start',
              FLEX_ITEMS_CENTER,
              'gap-3',
              'relative z-[1]'
            )}
          >
            <BasePrimaryBtn
              className={cx('min-w-[84px] h-[38px] disabled:!shadow-none', {
                'border-[1.5px] border-[var(--transparent-gray-50)]':
                  !isClaimable,
                'bg-shadow-[var(--box-shadow-5)]': isClaimable,
              })}
              disabled={!isClaimable}
              children={
                <span className={cx('text-base font-medium')}>
                  {t('earn_my_rewards_withdraw_claim')}
                </span>
              }
              onClick={handleClaimBtnClick}
            />

            <BaseSecondaryBtn
              className={cx(
                'min-w-[84px] h-[38px]',
                'bg-shadow-[var(--box-shadow-4)]'
              )}
              onClick={() => {
                handleTeamClubClick({
                  actionName: handleTeamClubWithDrawDetailButtonClick,
                });
              }}
              children={
                <span className={cx('text-base font-medium')}>
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
            'px-4 mobile:px-6',
            'rounded-b-lg',
            'w-full',
            'absolute bottom-0 left-0 z-[2]'
          )}
          style={{
            height: containerMetrics?.height / 2,
          }}
        >
          <div className={cx(FLEX_CENTER, 'flex-col', 'rounded', 'flex-1')}>
            <span
              className={cx(
                'bgi-text-[var(--base-2-variant1)]',
                'text-base',
                'text-center'
              )}
            >
              {t('earn_my_rewards_withdrwa_total_rewards')}
            </span>
            <span
              className={cx(
                'bgi-text-[var(--base-1-main)]',
                'text-lg font-semibold',
                'block'
              )}
            >
              {formatMoneyAbbrev({
                value: totalReward,
              })}
            </span>
          </div>

          {/* 分隔線 */}
          {/* <div
            className={cx(
              'w-px h-8',
              'border-l-[1px] bgi-border[var(--transparent-white-10)]',
              ''
            )}
          ></div> */}

          <div className={cx(FLEX_CENTER, 'flex-col', 'rounded', 'flex-1')}>
            <span
              className={cx(
                'bgi-text-[var(--base-2-variant1)]',
                'text-base text-center'
              )}
            >
              {t('earn_my_rewards_withdrwa_todays_rewards')}
            </span>
            <span
              className={cx(
                'bgi-text-[var(--base-1-main)]',
                'text-lg font-semibold',
                'block'
              )}
            >
              {formatMoneyAbbrev({
                value: todayReward,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamClubWithdrawRewards;
