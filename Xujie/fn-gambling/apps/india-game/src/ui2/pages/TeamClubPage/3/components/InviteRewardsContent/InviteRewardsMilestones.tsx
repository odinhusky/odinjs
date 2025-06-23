import './index.scss';
import Icon from '@components/Icon';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import cx from '@commonUtils/cx';
import Progress from 'antd/es/progress';
import { useTranslation } from 'react-i18next';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';
import { handleTeamClubInviteRewardClaimClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { InviteesMilestoneState } from '@libs/mode2/external/api/endpoint/teamClub/PostTeamInviteInformationEndpoint';
import useTeamClubPageActions from '@libs/mode2/action/teamClubPageAction/useTeamClubPageActions';
import { handleTeamClubPageNavToRulesPageClick } from '@mode2/action/actionTypes';

const HandleDot = ({ isAchieve }: { isAchieve: boolean }) => {
  return (
    <div
      className={cx('dot rounded-full border', {
        'bgi-[var(--base-1-variant1)] bgi-border-[var(--base-1-60)]': isAchieve,
        'bgi-[var(--base-2-variant14)] bgi-border-[var(--base-1-variant1)]':
          !isAchieve,
      })}
    />
  );
};

const MilestonesMark = ({
  isAchieve,
  achieveCount,
  requiredPeople,
  isCurrentProcess,
  status,
  settleId,
}: {
  isAchieve: boolean;
  achieveCount: number;
  requiredPeople: number;
  isCurrentProcess: boolean;
  status: InviteesMilestoneState;
  settleId: number;
}) => {
  const { t } = useTranslation();
  const { handleTeamClubClick } = useTeamClubAction();

  return (
    <div className={cx('flex flex-1 flex-col items-center')}>
      <div className="flex gap-1 items-center">
        {status === InviteesMilestoneState.CLAIMABLE ? (
          <BasePrimaryBtn
            className={cx('w-12 h-[18px]', 'mb-3 rounded')}
            debounceTimer={500}
            children={
              <span className={cx('text-xs')}>
                {t('earn_my_rewards_withdraw_claim')}
              </span>
            }
            onClick={() => {
              handleTeamClubClick({
                actionName: handleTeamClubInviteRewardClaimClick,
                payload: {
                  settleId,
                },
              });
            }}
          />
        ) : (
          <div className="flex items-center gap-1">
            <Icon className={'w-4 h-4'} name={'ic_member'} />
            <p
              className={cx('text-xs font-medium flex items-center', {
                'bgi-text-[var(--grayscale-100)]': isAchieve,
                'bgi-text-[var(--transparent-white-40)]': !isAchieve,
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
        )}
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
            <div className="w-full mx-[6px] flex flex-col gap-1 items-center relative">
              <img
                src={getImgUrl(
                  EResourceLevel.ICONS,
                  `ic_invite_reward_${index + 1}_${
                    item.status === InviteesMilestoneState.CLAIMABLE
                      ? 'claimable'
                      : 'unclaimable'
                  }`,
                  '.webp'
                )}
                alt="ic_invite_reward_claim"
                className={'w-[76px] h-[76px] object-contain'}
              />
              {item.status === InviteesMilestoneState.CLAIMED ? (
                <img
                  alt={item.levelResName}
                  className={cx('w-9 h-9', 'absolute mt-5')}
                  src={getImgUrl(EResourceLevel.ICONS, 'receive_tag')}
                />
              ) : null}

              <span className="text-base bgi-text-[var(--base-1-main)]">
                {formatMoney({ value: item.reward })}
              </span>
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
      <div className="handle-list flex justify-between bgi-text-[var(--state-warn-main)] items-center bg-shadow-[var(--box-shadow-3)]">
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
            status={item.status}
            settleId={item.settleId}
          />
        );
      })}
    </div>
  );
};

const InviteRewardsMilestones = () => {
  const { handleTeamClubClick } = useTeamClubAction();
  const { handleTeamClubPageClick } = useTeamClubPageActions();
  const { t } = useTranslation();
  const maxInvitees = useInviteRewardsContentStore(
    (state) => state.maxInvitees
  );
  const maxInvitationRewards = useInviteRewardsContentStore(
    (state) => state.maxInvitationRewards
  );
  const inviteRewardsClaimAll = useInviteRewardsContentStore(
    (state) => state.inviteRewardsClaimAll
  );

  return (
    <div
      className={cx(
        'flex flex-col',
        'bgi-[var(--base-2-variant11)] bg-shadow-[var(--box-shadow-2)]',
        'rounded-md p-4',
        'text-sm font-medium text-center'
      )}
    >
      {/*b.1*/}
      <div className="flex items-start justify-between bgi-text-[var(--state-warn-main)]">
        <div className="w-full flex flex-col text-start gap-2">
          <div className="w-full flex justify-between items-center">
            <span className="text-lg bgi-text-[var(--base-2-variant2)]">
              {t('earn_invite_rewards_invite_bonus', {
                maxInviteCount: maxInvitees,
              })}
              :
            </span>
            <Icon
              className={'w-5 h-5 cursor-pointer'}
              name="ic_tips_fill"
              onClick={() => {
                handleTeamClubPageClick({
                  actionName: handleTeamClubPageNavToRulesPageClick,
                });
              }}
            />
          </div>
          <span className="text-[32px] leading-9 bgi-text-[var(--base-1-main)] font-bold ">
            {formatMoney({ value: maxInvitationRewards })}
          </span>
        </div>
      </div>

      <div className="inline-flex justify-end">
        <BasePrimaryBtn
          className={cx('w-20 h-7', 'mb-3')}
          children={
            <span className={cx('text-sm')}>
              {t('mission_claim_all_button')}
            </span>
          }
          disabled={inviteRewardsClaimAll !== InviteesMilestoneState.CLAIMABLE}
          onClick={() => {
            handleTeamClubClick({
              actionName: handleTeamClubInviteRewardClaimClick,
              payload: {
                settleId: 0,
              },
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <InviteRewardsMilestonesStepRewards />

        <InviteRewardsMilestonesProgress />

        <InviteRewardsMilestonesAchieve />
      </div>
    </div>
  );
};
export default InviteRewardsMilestones;
