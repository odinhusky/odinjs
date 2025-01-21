import { formatNumber } from '@mode2/utils';
import '../index.scss';
import TeamDataTableBox from './TeamDataTableBox';
import { useMode2InvitePageTeamStore } from '@mode2/zustand/page/invitePageStore';
import { useTranslation } from 'react-i18next';
import useInvitePageActions from '@libs/mode2/action/invitePageAction/useInvitePageActions';
import { handleInvitePageTeamDataDetailBtnClick } from '@libs/mode2/action/invitePageAction/actionType';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

export const TeamData = () => {
  const { t } = useTranslation();
  const { handleInvitePageClick } = useInvitePageActions();
  const totalNumberOfInvitees = useMode2InvitePageTeamStore(
    (state) => state.totalNumberOfInvitees
  );

  const newNumberOfInvitees = useMode2InvitePageTeamStore(
    (state) => state.newNumberOfInvitees
  );

  const betValue = useMode2InvitePageTeamStore((state) => state.betValue);

  const numberOfDeposits = useMode2InvitePageTeamStore(
    (state) => state.numberOfDeposits
  );

  const activeMemberLevel = useMode2InvitePageTeamStore(
    (state) => state.activeMemberLevel
  );

  const weeklySalaryReward = useMode2InvitePageTeamStore(
    (state) => state.weeklySalaryReward
  );

  const rankingRewards = useMode2InvitePageTeamStore(
    (state) => state.rankingRewards
  );

  const totalCommission = useMode2InvitePageTeamStore(
    (state) => state.totalCommission
  );

  return (
    <div className={cx(FLEX_COL, 'gap-3', 'pb-6 mobile:pb-10 tablet:pb-0')}>
      <TeamDataTableBox
        headTitle={{
          i18nKey: 'earn_money_team_data_title_total_number_of_invitees',
        }}
        bodyData={totalNumberOfInvitees.bodyData}
        headTitleClass={'!bgi-text-[var(--base-1-main)]'}
      />
      <TeamDataTableBox
        headTitle={{
          i18nKey: 'earn_money_team_data_title_new_number_of_invitees',
        }}
        bodyData={newNumberOfInvitees.bodyData.map((item) => ({
          ...item,
          bodyValue: `+${formatNumber(item.bodyValue)}`,
        }))}
        headTitleClass={'!bgi-text-[var(--base-1-main)]'}
      />
      <TeamDataTableBox
        headTitle={{ i18nKey: 'earn_money_team_data_title_bet_value' }}
        subtitle="(INR)"
        bodyData={betValue.bodyData.map((item) => ({
          ...item,
          bodyValue: formatNumber(item.bodyValue, true),
        }))}
      />
      <TeamDataTableBox
        headTitle={{ i18nKey: 'earn_money_team_data_title_number_of_deposito' }}
        subtitle="(INR)"
        bodyData={numberOfDeposits.bodyData.map((item) => ({
          ...item,
          bodyValue: formatNumber(item.bodyValue, true),
        }))}
      />
      <TeamDataTableBox
        headTitle={{ i18nKey: 'earn_money_team_data_title_active_member' }}
        bodyData={activeMemberLevel.bodyData}
      />
      <TeamDataTableBox
        headTitle={{
          i18nKey: 'earn_money_team_data_title_weekly_salary_reward',
        }}
        subtitle="(INR)"
        bodyData={weeklySalaryReward.bodyData.map((item) => ({
          ...item,
          bodyValue: formatNumber(item.bodyValue, true),
        }))}
      />
      <TeamDataTableBox
        headTitle={{ i18nKey: 'earn_money_team_data_title_ranking_rewards' }}
        subtitle="(INR)"
        bodyData={rankingRewards.bodyData.map((item) => ({
          ...item,
          bodyValue: formatNumber(item.bodyValue, true),
        }))}
      />
      <TeamDataTableBox
        headTitle={{ i18nKey: 'earn_money_team_data_title_total_commission' }}
        subtitle="(INR)"
        bodyData={totalCommission.bodyData.map((item) => ({
          ...item,
          bodyValue: formatNumber(item.bodyValue, true),
        }))}
      />

      <BasePrimaryBtn
        className="font-semibold"
        onClick={() => {
          handleInvitePageClick({
            actionName: handleInvitePageTeamDataDetailBtnClick,
          });
        }}
      >
        <span className="bgi-text-[var(--linear-4)]">
          {t('earn_money_team_data_btn_detail')}
        </span>
      </BasePrimaryBtn>
    </div>
  );
};
