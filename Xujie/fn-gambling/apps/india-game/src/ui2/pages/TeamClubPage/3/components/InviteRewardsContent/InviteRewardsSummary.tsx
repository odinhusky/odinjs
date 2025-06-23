import { cx } from '@libs/commonUtils';
import { formatMoney } from '@libs/mode2/utils';
import Icon from '@components/Icon';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import {
  handleTeamClubPageTotalInvitesClick,
  handleTeamClubPageTotalRewardsClick,
} from '@mode2/action/actionTypes';
import * as React from 'react';
import { memo } from 'react';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';
import { useTranslation } from 'react-i18next';
import QuestionTooltip from '@components/QuestionTooltip';

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
    'rounded-md',
    'p-4 box-border',
    'flex justify-end items-center',
    'border border-[var(--transparent-white-10)] bgi-[var(--base-2-variant8)] bg-shadow-[var(--box-shadow-2)]'
  );

  const titleClass = 'bgi-text-[var(--base-2-variant2)] text-lg';
  const valueClass = 'bgi-text-[var(--base-1-main)] text-xl';

  return (
    <div>
      <div className="flex gap-4 justify-center w-full">
        <div className={cx(baseBlockClass, '')}>
          <div className="flex flex-col gap-1 items-center w-full">
            <span className={titleClass}>
              {t('earn_invite_rewards_total_rewards')}
            </span>
            <span className={valueClass}>
              {formatMoney({
                value: totalInvitationRewards,
                includeDecimal: true,
              })}
            </span>
          </div>
          <Icon
            className={'ml-1 w-6 h-6 p-1 cursor-pointer z-[1]'}
            name="ic_arrow_right_3"
            color={'var(--grayscale-100)'}
            onClick={() => {
              handleTeamClubPageClick({
                actionName: handleTeamClubPageTotalRewardsClick,
              });
            }}
          />
        </div>

        <div className={cx(baseBlockClass, '')}>
          <div className="flex flex-col gap-1 items-center w-full">
            <div className="flex items-center gap-1">
              <span className={titleClass}>
                {t('earn_invite_rewards_total_invites')}
              </span>
              <QuestionTooltip
                placement={'bottomRight'}
                btnClassName="!p-0"
                iconClassName="!w-5 !h-5"
                offset={[11, 7]}
                title={t('earn_invite_rewards_total_invites_tips', {
                  totalInvitees: totalInvitees,
                  validInvitees: validInvitees,
                })}
              />
            </div>
            <div className="flex items-center">
              <Icon className={'w-7 h-7'} name="ic_member" />
              <span className={cx(valueClass, 'ml-1')}>
                {formatMoney({
                  value: validInvitees,
                  showCurrency: false,
                })}
              </span>
            </div>
          </div>
          <Icon
            className={'w-4 h-4 cursor-pointer'}
            name="ic_arrow_right_3"
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
