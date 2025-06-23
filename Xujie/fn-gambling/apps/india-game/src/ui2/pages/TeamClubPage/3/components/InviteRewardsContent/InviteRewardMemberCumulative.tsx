import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import {
  handleTeamClubPageInviteFriendBtnClick,
  handleTeamClubPageNavToMonthRulesPageClick,
} from '@mode2/action/actionTypes';
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

  const rewardForInvitee = useInviteRewardsContentStore(
    (state) => state.rewardForInvitee
  );

  const dailyValidInvitees = useInviteRewardsContentStore(
    (state) => state.dailyValidInvitees
  );

  const dailyInviteLimit = useInviteRewardsContentStore(
    (state) => state.dailyInviteLimit
  );

  return (
    <div
      className={cx(
        'flex flex-col items-center text-center',
        'bgi-[var(--base-2-variant8)] bg-shadow-[var(--box-shadow-2)]',
        'rounded-lg p-3'
      )}
    >
      <div className="w-full items-center relative">
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center justify-center gap-1 w-full text-center">
            <span
              className={cx(
                'text-lg font-bold',
                'bgi-text-[var(--grayscale-100)]'
              )}
            >
              {t('earn_invite_rewards_invite_new')}
            </span>
            <Icon
              className={'w-5 h-5 cursor-pointer'}
              name="ic_tips_fill"
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageNavToMonthRulesPageClick,
                });
              }}
            />
          </div>
          <span
            className={cx(
              'text-4xl font-bold',
              ' w-full text-center bgi-text-[var(--base-1-main)]'
            )}
          >
            {formatMoney({ value: rewardPerInvite })}
          </span>
          <span className="bgi-text-[var(--base-2-variant1)]">
            <span>Invited friends get&nbsp;</span>
            <b className="bgi-text-[var(--base-1-main)]">
              {formatMoney({ value: rewardForInvitee })}
            </b>
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col justify-center gap-1">
        <BasePrimaryBtn
          className="h-[46px] z-[1] my-4 text-xl font-bold bg-shadow-[var(--box-shadow)]"
          onClick={() => {
            handleTeamClubPageClick({
              actionName: handleTeamClubPageInviteFriendBtnClick,
            });
          }}
          children={t('earn_invite_rewards_invite_button')}
        />

        <div className={cx('text-lg', 'bgi-text-[var(--base-2-variant2)]')}>
          {t('earn_invite_rewards_invite_count')}:&nbsp;{dailyValidInvitees}/
          {dailyInviteLimit}
        </div>
      </div>
    </div>
  );
};

export default InviteRewardMemberCumulative;
