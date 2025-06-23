import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { I18NContent } from '@mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@mode2/zustand/page/teamClubRulesPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { Icon } from '@components/Icon';
import { useInviteRewardsContentStore } from '@mode2/zustand/components/inviteRewardsContentStore';

export interface I18NContentExt extends I18NContent {
  itemPrefixIcon?: string;
  itemPrefix?: string;
}

export interface TeamClubRuleGroup {
  title: I18NContentExt;
  contents: I18NContentExt[];
  number?: boolean;
  itemPrefixIcon?: string;
  itemPrefix?: string;
  itemSerialSuffix?: string;
}

export const RuleGroupTitle = ({ title }: { title: I18NContentExt }) => {
  const { t } = useTranslation();
  return (
    <div
      className={cx(
        'bgi-text-[var(--state-warning-main)]',
        'font-bold text-xl text-center'
      )}
    >
      {renderI18N(title, t)}
    </div>
  );
};

const DescriptionItem = ({
  index,
  group,
  item,
  itemSerialSuffix = ':',
}: {
  index: number;
  group: TeamClubRuleGroup;
  item: I18NContentExt;
  itemSerialSuffix?: string;
}) => {
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );
  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const rewardPerInvite = useInviteRewardsContentStore(
    (state) => state.rewardPerInvite
  );

  const rewardForInvitee = useInviteRewardsContentStore(
    (state) => state.rewardForInvitee
  );
  const i18nOption = {
    i18nOption: {
      validDepositRebates: formatMoney({ value: validDepositRebates }),
      commission: formatMoney({ value: inviteDailyRule.commission }),
      rewardInvitee: formatMoney({ value: inviteDailyRule.rewardForInvitee }),
      dailyValidInvitees: inviteDailyRule.dailyValidInvitees,
      validInviteRebates: formatMoney({
        value: inviteDailyRule.validInviteRebates,
      }),
      productName: sdkUtils.productName(),
      inviter: rewardPerInvite,
      rewardForInvitee: rewardForInvitee,
    },
  };
  const { t } = useTranslation();
  const { itemPrefixIcon, itemPrefix, number } = group;
  return (
    <div
      className={cx(
        'flex justify-start items-start',
        'bgi-text-[var(--base-1-variant2)] text-sm'
      )}
    >
      {itemPrefixIcon ? (
        <Icon className="w-3 h-3 mr-1 mt-1" name={itemPrefixIcon} />
      ) : null}
      {itemPrefix ? (
        <p className="mr-0.5">{renderI18N({ i18nKey: itemPrefix }, t)}</p>
      ) : null}
      {number === true ? (
        <p className="mr-1">{`${index + 1}${itemSerialSuffix} `}</p>
      ) : null}
      <p>{renderI18N({ ...item, ...i18nOption }, t)}</p>
    </div>
  );
};

const RuleDescriptionGroup = ({ group }: { group: TeamClubRuleGroup }) => {
  return (
    <div className="flex flex-col justify-center gap-2">
      <RuleGroupTitle title={group.title} />
      {group.contents.map((item, index) => {
        return (
          <DescriptionItem
            key={index}
            group={group}
            item={item}
            index={index}
            itemSerialSuffix={group.itemSerialSuffix}
          />
        );
      })}
    </div>
  );
};

export const TeamClubRuleDescriptionGroups = ({
  groups,
}: {
  groups: TeamClubRuleGroup[];
}) => {
  return (
    <div
      className={cx(
        'bgi-[var(--base-2-variant12)]',
        'mx-8',
        'bgi-border-[var(--linear-15)] border',
        'rounded-lg'
      )}
    >
      <div
        className={cx('flex flex-col gap-5', 'px-2.5 py-4')}
        style={{
          backgroundImage: `url(${getImgUrl(
            EResourceLevel.V,
            'background_club_my_rewards'
          )})`,
        }}
      >
        {groups.map((group, index) => {
          return <RuleDescriptionGroup key={index} group={group} />;
        })}
      </div>
    </div>
  );
};

export default TeamClubRuleDescriptionGroups;
