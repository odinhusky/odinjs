import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import {
  handleTeamClubPageInviteFriendBtnClick,
  handleTeamClubPageNavToMonthRulesPageClick,
} from '@mode2/action/teamClubPageAction/actionType';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import { formatMoney } from '@mode2/utils';
import Icon from '@components/Icon';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';
import { useTranslation } from 'react-i18next';

const InviteRewardMemberCumulative = () => {
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  const { t } = useTranslation();

  const rewardPerInvite = useInviteRewardsContentStore(
    (state) => state.rewardPerInvite
  );

  const dailyValidInvitees = useInviteRewardsContentStore(
    (state) => state.dailyValidInvitees
  );

  const dailyInviteLimit = useInviteRewardsContentStore(
    (state) => state.dailyInviteLimit
  );

  const titleClass = 'w-full bgi-text-[var(--grayscale-100)] text-sm';
  const valueClass = 'bgi-text-[--state-warn-main] text-[32px] font-bold';
  const labelClass =
    'text-xs mobile:text-sm bgi-text-[var(--transparent-white-50)]';

  return (
    <div
      className={cx(
        'flex flex-col gap-2 items-center text-center',
        'bgi-border-[var(--base-2-light)] bgi-[var(--linear-1)]',
        'rounded-lg p-3'
      )}
    >
      <div className="w-full items-center relative">
        <div className="flex flex-col justify-center gap-1">
          <span className={cx(titleClass, 'w-full text-center')}>
            {t('earn_invite_rewards_invite_new')}
          </span>

          <span className={cx(valueClass, ' w-full text-center')}>
            {formatMoney(rewardPerInvite)}
          </span>
        </div>

        <Icon
          className={'absolute right-0 top-0 w-5 h-5 p-1 cursor-pointer z-[1]'}
          name="ic_arrow_right_1"
          color={'var(--grayscale-100)'}
          onClick={() => {
            handleTeamClubPageClick({
              actionName: handleTeamClubPageNavToMonthRulesPageClick,
            });
          }}
        />
      </div>

      <div className="w-full flex flex-col justify-center gap-1">
        <BasePrimaryBtn
          className="z-[1]"
          onClick={() => {
            handleTeamClubPageClick({
              actionName: handleTeamClubPageInviteFriendBtnClick,
            });
          }}
          children={t('earn_invite_rewards_invite_button')}
        />

        <div className={labelClass}>
          {t('earn_invite_rewards_invite_count', {
            dailyValidInvitees: dailyValidInvitees,
            dailyInviteLimit: dailyInviteLimit,
          })}
        </div>
      </div>
    </div>
  );
};

export default InviteRewardMemberCumulative;
