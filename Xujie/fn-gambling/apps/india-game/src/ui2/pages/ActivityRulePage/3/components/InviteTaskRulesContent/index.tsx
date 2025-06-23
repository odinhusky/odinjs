import Table, { ITableColumn } from '@components/Table';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useTeamClubRulesStore } from '@mode2/zustand/page/teamClubRulesPageStore';
import { InviteTeamRewardRuleItemResult } from '@mode2API/endpoint/teamClub/PostInviteTeamRewardConfigEnpoint';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';
import {
  RuleGroupTitle,
  TeamClubRuleDescriptionGroups,
  TeamClubRuleGroup,
} from '../../components/TeamClubRuleDescriptionGroups';
import cx from '@commonUtils/cx';

// interface ColumnType {
//   invitationCount: number;
//   commission: number;
// }

const InviteTaskRulesContent = () => {
  useTeamClubRulesBase();
  const { t } = useTranslation();

  const inviteTaskRules = useTeamClubRulesStore(
    (state) => state.inviteTaskRules
  );
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );

  const data: TeamClubRuleGroup[][] = [
    [
      {
        itemPrefixIcon: 'ic_step',
        itemPrefix: 'Step',
        number: true,
        title: {
          i18nKey: 'earn_invite_rewards_rules_how_to_participate_title',
        },
        contents: [
          {
            i18nKey: 'earn_invite_rewards_rules_step_register',
          },
          {
            i18nKey: 'earn_invite_rewards_rules_step_invite_friends_action',
          },
          {
            i18nKey:
              'earn_invite_rewards_rules_step_friends_register_and_enter_code',
          },
          {
            i18nKey: 'earn_invite_rewards_rules_step_friends_deposit_amount',
          },
          {
            i18nKey: 'earn_invite_rewards_rules_step_receive_rewards',
          },
        ],
      },
      {
        number: false,
        title: {
          i18nKey: 'earn_invite_rewards_rules_valid_invited_user_title',
        },
        contents: [
          {
            i18nKey: 'earn_invite_rewards_rules_valid_invited_user_content',
          },
        ],
      },
    ],
  ];

  const columns: ITableColumn<InviteTeamRewardRuleItemResult>[] = [
    {
      title: 'earn_invite_rewards_rules_bonus_form_invitation_count',
      dataIndex: 'invitationCount',
    },
    {
      title: 'earn_invite_rewards_rules_bonus_form_rewards',
      dataIndex: 'commission',
      render: (record) => formatMoney({ value: record.commission }),
    },
  ];
  return (
    <div className="flex flex-col gap-5 -mx-4 pb-[70px]">
      <img
        className="w-full"
        src={getImgUrl(EResourceLevel.V, 'club_rules_invite_300')}
        alt="banner1"
      />

      <div className="-mt-[80px]">
        {data.map((groups, index) => {
          return <TeamClubRuleDescriptionGroups key={index} groups={groups} />;
        })}
      </div>

      <div>
        <RuleGroupTitle
          title={{
            i18nKey: 'earn_invite_rewards_rules_bonus_rewards_detail_title',
          }}
        />

        <div
          className={cx(
            'mx-8 mt-2',
            'bgi-border-[var(--linear-15)] border',
            'rounded-lg',
            'bgi-[var(--base-2-variant12)]'
          )}
        >
          <div
            style={{
              backgroundImage: `url(${getImgUrl(
                EResourceLevel.V,
                'background_club_my_rewards'
              )})`,
            }}
          >
            <Table
              classNames={{
                table: cx(
                  '!p-0 !m-0 bg-transparent !border-collapse !bgi-text-[var(--base-1-main)]',
                  ''
                ),
                thead: '!p-0 !m-0 !bg-transparent ',
                theadTr: '!p-0 !m-0 !gap-0',
                theadTth:
                  '!text-base !font-bold !bgi-border-[var(--linear-15)] border !bgi-text-[var(--base-1-main)]',
                tbody: '',
                tbodyTr: '',
                tbodyTd:
                  '!bgi-border-[var(--linear-15)] border !font-medium !text-base',
              }}
              rowKey={'indexKey'}
              dataSource={inviteTaskRules}
              columns={columns}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteTaskRulesContent;
