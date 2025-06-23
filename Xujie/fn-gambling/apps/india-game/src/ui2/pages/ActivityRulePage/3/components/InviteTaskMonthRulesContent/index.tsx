import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import sdkUtils from '@libs/mode2/utils/sdk';
import useTeamClubRulesBase from '@mode2/usecase/useTeamClubRulesBase';
import TeamClubRuleDescriptionGroups, {
  TeamClubRuleGroup,
} from '../../components/TeamClubRuleDescriptionGroups';

const InviteTaskMonthRulesContent = () => {
  useTeamClubRulesBase();

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
    [
      {
        itemPrefixIcon: 'ic_step',
        number: true,
        title: { i18nKey: 'earn_invite_rewards_rules_rewards_detail_title' },
        itemSerialSuffix: '.',
        contents: [
          {
            i18nKey: 'earn_invite_rewards_rules_invitation_reward_details',
            i18nOption: {
              productName: sdkUtils.productName(),
            },
          },
          {
            i18nKey: 'earn_invite_rewards_rules_max_daily_reward',
            i18nOption: {
              productName: sdkUtils.productName(),
            },
          },
          {
            i18nKey: 'earn_invite_rewards_rules_reward_usage_info',
          },
          {
            i18nKey: 'earn_invite_rewards_rules_distribution',
            i18nOption: {
              productName: sdkUtils.productName(),
            },
          },
          // {
          //   i18nKey: 'earn_invite_rewards_rules_settlement_note',
          // },
        ],
      },
    ],
  ];

  return (
    <div className="flex flex-col gap-5 -mx-4 pb-[70px]">
      <img
        className="w-full"
        src={getImgUrl(EResourceLevel.V, 'club_rules_invite_a_friend')}
        alt="banner1"
      />

      <div className={'-mt-[124px] flex flex-col gap-6'}>
        {data.map((groups, index) => {
          return <TeamClubRuleDescriptionGroups key={index} groups={groups} />;
        })}
      </div>
    </div>
  );
};

export default InviteTaskMonthRulesContent;
