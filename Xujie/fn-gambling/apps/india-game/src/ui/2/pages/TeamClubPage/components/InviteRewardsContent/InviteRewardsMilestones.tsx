import './index.scss';
import Icon from '@mode2/components/Icon';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import useTeamClubPageActions from '@mode2/action/teamClubPageAction/useTeamClubPageActions';
import cx from '@commonUtils/cx';
import * as React from 'react';
import Progress from 'antd/es/progress';
import { handleTeamClubPageNavToRulesPageClick } from '@mode2/action/teamClubPageAction/actionType';
import { useTranslation } from 'react-i18next';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';

const HandleDot = ({ isAchieve }: { isAchieve: boolean }) => {
  return (
    <div
      className={cx('dot rounded-full border', {
        'bgi-[var(--grayscale-100)] bgi-border-[var(--base-2-main)]': isAchieve,
        'bgi-[var(--base-1-main)] bgi-border-[var(--linear-2)]': !isAchieve,
      })}
    />
  );
};

const MilestonesMark = ({
  isAchieve,
  achieveCount,
  requiredPeople,
  isCurrentProcess,
}: {
  isAchieve: boolean;
  achieveCount: number;
  requiredPeople: number;
  isCurrentProcess: boolean;
}) => {
  return (
    <div
      className={cx('flex flex-1 flex-col items-center grow gap-2 justify-end')}
    >
      <div className="flex flex-col items-center">
        <Icon
          className={'w-3 h-3'}
          name={isAchieve ? 'ic_check' : 'ic_user'}
          color="var(--base-2-main)"
        />
        <p
          className={cx('text-xxs', {
            'bgi-text-[var(--grayscale-100)]': isAchieve,
            'bgi-text-[var(--transparent-white-50)]': !isAchieve,
          })}
        >
          <span
            className={cx({
              'bgi-text-[var(--grayscale-100)]': isCurrentProcess,
            })}
          >
            {achieveCount}
          </span>
          <span>{'/'}</span>
          <span>{requiredPeople}</span>
        </p>
      </div>
    </div>
  );
};

const InviteRewardsMilestonesStepRewards = () => {
  const inviteesLevelMilestoneItems = useInviteRewardsContentStore(
    (state) => state.inviteesLevelMilestoneItems
  );
  return (
    <div className="flex justify-between bgi-text-[var(--state-warn-main)]">
      {inviteesLevelMilestoneItems.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-1 flex-col items-center grow gap-2 justify-end"
          >
            <div className="w-full mx-[6px] flex flex-col items-center">
              <img
                alt={item.levelResName}
                className={'w-10 h-10 object-contain'}
                src={getImgUrl(EResourceLevel.V, item.levelResName)}
              />
              <span>{formatMoney(item.reward)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
/**
 * 邀請人數里程進度
 * @constructor
 */
const InviteRewardsMilestonesProgress = () => {
  const inviteesLevelMilestoneItems = useInviteRewardsContentStore(
    (state) => state.inviteesLevelMilestoneItems
  );

  const validMilestoneProgress = useInviteRewardsContentStore(
    (state) => state.validMilestoneProgress
  );

  return (
    <div className="invite-rewards-milestones-progress">
      <Progress
        className="absolute left-0"
        percent={validMilestoneProgress}
        showInfo={false}
      />
      <div className="handle-list flex justify-between bgi-text-[var(--state-warn-main)] items-center">
        {inviteesLevelMilestoneItems.map((item, index) => {
          return <HandleDot key={index} isAchieve={item.isAchieve} />;
        })}
      </div>
    </div>
  );
};

const InviteRewardsMilestonesAchieve = () => {
  const inviteesLevelMilestoneItems = useInviteRewardsContentStore(
    (state) => state.inviteesLevelMilestoneItems
  );

  return (
    <div className="flex justify-between bgi-text-[var(--state-warn-main)]">
      {inviteesLevelMilestoneItems.map((item, index) => {
        return (
          <MilestonesMark
            key={`${index}_${item.levelResName}`}
            isAchieve={item.isAchieve}
            achieveCount={item.achieveCount}
            requiredPeople={item.requiredPeople}
            isCurrentProcess={item.isCurrentProgress}
          />
        );
      })}
    </div>
  );
};

const InviteRewardsMilestones = () => {
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  const { t } = useTranslation();
  const maxInvitees = useInviteRewardsContentStore(
    (state) => state.maxInvitees
  );
  const maxInvitationRewards = useInviteRewardsContentStore(
    (state) => state.maxInvitationRewards
  );

  return (
    <div
      className={cx(
        'flex flex-col gap-2',
        'bgi-[var(--linear-1)]',
        'bgi-border-[var(--base-2-light)]',
        'rounded-lg p-3',
        'text-sm font-medium text-center'
      )}
    >
      {/*b.1*/}
      <div className="flex items-start justify-between bgi-text-[var(--state-warn-main)]">
        <div className="flex flex-col text-start gap-1">
          <span className="bgi-text-[var(--grayscale-100)]">
            {t('earn_invite_rewards_invite_bonus', {
              maxInviteCount: maxInvitees,
            })}
          </span>
          <span className="text-2xl font-bold ">
            {formatMoney(maxInvitationRewards)}
          </span>
        </div>

        <Icon
          className={'ml-1 w-5 h-5 p-1 cursor-pointer z-[1]'}
          name="ic_arrow_right_1"
          color={'var(--grayscale-100)'}
          onClick={() => {
            handleTeamClubPageClick({
              actionName: handleTeamClubPageNavToRulesPageClick,
            });
          }}
        />
      </div>

      <InviteRewardsMilestonesStepRewards />

      <InviteRewardsMilestonesProgress />

      <InviteRewardsMilestonesAchieve />
    </div>
  );
};
export default InviteRewardsMilestones;
