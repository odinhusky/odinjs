import Table, { ITableColumn } from '@components/Table';
import renderI18N from '@libs/commonUtils/renderI18N';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useTeamClubRulesStore } from '@mode2/zustand/page/teamClubRulesPageStore';
import { InviteTeamRewardRuleItemResult } from '@mode2API/endpoint/teamClub/PostInviteTeamRewardConfigEnpoint';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';

// interface ColumnType {
//   invitationCount: number;
//   commission: number;
// }

const InviteTaskRulesContent = () => {
  useTeamClubRulesBase();
  const { t } = useTranslation();
  const bgMainPath = getImgUrl(EResourceLevel.V, 'rules_background_m');

  const inviteTaskRules = useTeamClubRulesStore(
    (state) => state.inviteTaskRules
  );
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );

  const dataArr = [
    {
      title: 'earn_invite_rewards_rules_how_to_participate_title',
      contents: [
        'earn_invite_rewards_rules_step_register',
        'earn_invite_rewards_rules_step_invite_friends_action',
        'earn_invite_rewards_rules_step_friends_register_and_enter_code',
        'earn_invite_rewards_rules_step_friends_deposit_amount',
        'earn_invite_rewards_rules_step_receive_rewards',
      ],
    },
    {
      title: 'earn_invite_rewards_rules_valid_invited_user_title',
      contents: 'earn_invite_rewards_rules_valid_invited_user_content',
    },
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
    <div
      className="flex flex-col gap-5 mobile:-mx-5 -mx-4 pb-[70px]"
      style={{
        backgroundImage: `url(${bgMainPath})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '100% 100%',
        minHeight: '100vh',
        backgroundAttachment: 'fixed',
      }}
    >
      <img
        className="w-full"
        src={getImgUrl(EResourceLevel.V, 'invite_rewards_rules_banner_2_m')}
        alt="banner1"
      />

      {dataArr.map((data, index) => {
        return (
          <div key={index}>
            <RulesImgTitle
              classNameText="drop-shadow-[0px_2px_2px_#33333340]"
              title={{ i18nKey: data.title }}
            />
            <RulesContainer
              className="w-auto bgi-border-[var(--base-2-light)] mx-[3%] p-3 m-3"
              children={
                <div className="text-sm font-medium bgi-text-[var(--grayscale-100)]">
                  {Array.isArray(data.contents) ? (
                    <div className="flex flex-col gap-1">
                      {data.contents.map((item, i) => {
                        return (
                          <div
                            key={item + '_' + i}
                            className="grid grid-cols-[0fr_1fr]"
                          >
                            <div className="text-nowrap mr-1">
                              {renderI18N(
                                {
                                  i18nKey: `earn_invite_rewards_rules_step_${
                                    i + 1
                                  }`,
                                },
                                t
                              )}
                              :
                            </div>
                            <div className="w-full">
                              {renderI18N(
                                {
                                  i18nKey: item,
                                  i18nOption: {
                                    validDepositRebates: formatMoney({
                                      value: validDepositRebates,
                                    }),
                                  },
                                },
                                t
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      {renderI18N(
                        {
                          i18nKey: data.contents,
                          i18nOption: {
                            validDepositRebates: formatMoney({
                              value: validDepositRebates,
                            }),
                          },
                        },
                        t
                      )}
                    </div>
                  )}
                </div>
              }
            />
          </div>
        );
      })}
      <div>
        <RulesImgTitle
          classNameText="drop-shadow-[0px_2px_2px_#33333340]"
          title={{
            i18nKey: 'earn_invite_rewards_rules_bonus_rewards_detail_title',
          }}
        />
        <RulesContainer
          className="w-auto mx-[3%] mt-3 bgi-border-[var(--base-1-light)]"
          children={
            <Table
              classNames={{
                thead:
                  'bgi-border-b-[var(--base-1-light)] !bgi-text-[var(--base-2-main)] !bgi-[#00000000] !border-none font-semibold',
                theadTr: '!p-0 !gap-0 !py-[6px]',
                tbodyTr:
                  '!h-auto !bgi-[#00000000] !bgi-text-[var(--grayscale-100)] !p-0',
              }}
              rowKey={'indexKey'}
              dataSource={inviteTaskRules}
              columns={columns}
            />
          }
        />
        <div className="text-sm bgi-text-[var(--grayscale-100)] font-normal mx-[3%] mt-3">
          *
          {renderI18N(
            { i18nKey: 'earn_invite_rewards_rules_settlement_note' },
            t
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteTaskRulesContent;
