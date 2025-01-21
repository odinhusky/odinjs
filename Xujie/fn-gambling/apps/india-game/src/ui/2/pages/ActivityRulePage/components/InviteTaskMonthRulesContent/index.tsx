import cx from '@libs/commonUtils/cx';
import renderI18N from '@libs/commonUtils/renderI18N';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import { useTranslation } from 'react-i18next';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';
import { useTeamClubRulesStore } from '@mode2/zustand/page/teamClubRulesPageStore';
import RulesImgTitle from '@components/RulesImgTitle';
import RulesContainer from '@components/RulesContainer';
const InviteTaskMonthRulesContent = () => {
  useTeamClubRulesBase();
  const { t } = useTranslation();
  const productName = sdkUtils.productName();
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );
  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );

  const bgMainPath = getImgUrl(EResourceLevel.V, 'rules_background_m');
  const dataArr = [
    {
      title: 'earn_invite_rewards_rules_how_to_participate_title',
      on: 'Step',
      contents: [
        'earn_invite_rewards_rules_step_register',
        'earn_invite_rewards_rules_step_invite_friends_action',
        'earn_invite_rewards_rules_step_friends_register_and_enter_code',
        'earn_invite_rewards_rules_step_friends_deposit_amount',
        'earn_invite_rewards_rules_step_receive_rewards',
      ],
      param: [],
    },
    {
      title: 'earn_invite_rewards_rules_valid_invited_user_title',
      on: '',
      contents: 'earn_invite_rewards_rules_valid_invited_user_content',
      param: [],
    },
    {
      title: 'earn_invite_rewards_rules_rewards_detail_title',
      on: 'number',
      contents: [
        'earn_invite_rewards_rules_invitation_reward_details',
        'earn_invite_rewards_rules_max_daily_reward',
        'earn_invite_rewards_rules_reward_usage_info',
        'earn_invite_rewards_rules_distribution',
        'earn_invite_rewards_rules_settlement_note',
      ],
      param: [null, null, null, productName, null],
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
        src={getImgUrl(EResourceLevel.V, 'invite_rewards_rules_banner_1_m')}
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
              className="bgi-border-[var(--base-2-light)] mx-[3%] p-3 m-3 w-auto"
              children={
                <div className="text-sm font-normal bgi-text-[var(--grayscale-100)]">
                  {Array.isArray(data.contents) ? (
                    <div className="flex flex-col gap-1">
                      {data.contents.map((item, i) => {
                        return (
                          <div
                            key={item + '_' + i}
                            className="grid grid-cols-[0fr_1fr]"
                          >
                            <div className="text-nowrap mr-1">
                              {data.on === 'Step'
                                ? renderI18N(
                                    {
                                      i18nKey: `earn_invite_rewards_rules_step_${
                                        i + 1
                                      }`,
                                    },
                                    t
                                  ) + ':'
                                : data.on === 'number'
                                ? i + 1 + '.'
                                : ''}
                            </div>
                            <div className="w-full">
                              {renderI18N(
                                {
                                  i18nKey: item,
                                  i18nOption: {
                                    validDepositRebates:
                                      formatMoney(validDepositRebates),
                                    commission: formatMoney(
                                      inviteDailyRule.commission
                                    ),
                                    dailyValidInvitees:
                                      inviteDailyRule.dailyValidInvitees,
                                    validInviteRebates: formatMoney(
                                      inviteDailyRule.validInviteRebates
                                    ),
                                    productName: data.param[i],
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
                            validDepositRebates:
                              formatMoney(validDepositRebates),
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
    </div>
  );
};

export default InviteTaskMonthRulesContent;
