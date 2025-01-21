import { cx } from '@libs/commonUtils';
import { formatMoney, formatNumber } from '@libs/mode2/utils';
import Icon from '@mode2/components/Icon';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import {
  handleTeamClubPageTotalInvitesClick,
  handleTeamClubPageTotalRewardsClick,
} from '@mode2/action/teamClubPageAction/actionType';
import * as React from 'react';
import { memo } from 'react';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';
import { useTranslation } from 'react-i18next';
import QuestionTooltip from '@pages/TeamClubPage/components/QuestionTooltip';

const InviteRewardsSummary = memo(() => {
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  const { t } = useTranslation();
  const totalInvitationRewards = useInviteRewardsContentStore(
    (state) => state.totalInvitationRewards
  );

  const totalInvitees = useInviteRewardsContentStore(
    (state) => state.totalInvitees
  );

  const validInvitees = useInviteRewardsContentStore(
    (state) => state.validInvitees
  );

  const baseBlockClass = cx(
    'h-20 w-full',
    'rounded-lg',
    'py-3 px-1',
    'flex justify-end bgi-[var(--linear-1)] items-center',
    'bgi-border-[var(--base-2-light)]'
  );

  const titleClass = 'bgi-text-[var(--grayscale-100)] text-sm';
  const valueClass = 'bgi-text-[--state-warn-main] text-lg';

  return (
    <div>
      <div className="flex gap-4 justify-center w-full">
        <div className={cx(baseBlockClass, 'rounded-tl-[20px]')}>
          <div className="flex flex-col gap-1 items-center w-full">
            <span className={titleClass}>
              {t('earn_invite_rewards_total_rewards')}
            </span>
            <span className={valueClass}>
              {formatMoney(totalInvitationRewards)}
            </span>
          </div>
          <Icon
            className={'ml-1 w-5 h-5 p-1 cursor-pointer z-[1]'}
            name="ic_arrow_right_1"
            color={'var(--grayscale-100)'}
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageTotalRewardsClick,
              });
            }}
          />
        </div>

        <div className={cx(baseBlockClass, 'rounded-tr-[20px]')}>
          <div className="flex flex-col gap-1 items-center w-full">
            <div className="flex items-center">
              <QuestionTooltip
                placement={'bottom'}
                title={t('earn_invite_rewards_total_invites_tips', {
                  totalInvitees: totalInvitees,
                  validInvitees: validInvitees,
                })}
              />
              <span className={titleClass}>
                {t('earn_invite_rewards_valid_invites')}
              </span>
            </div>
            <div className="flex items-center">
              <Icon
                className={'w-5 h-5'}
                name="ic_game_player"
                color={'var(--state-warn-main)'}
              />
              <span className={cx(valueClass, 'ml-1')}>
                {formatNumber(validInvitees)}
              </span>
            </div>
          </div>
          <Icon
            className={'w-5 h-5 p-1 cursor-pointer z-[1]'}
            name="ic_arrow_right_1"
            color={'var(--grayscale-100)'}
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageTotalInvitesClick,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default InviteRewardsSummary;
