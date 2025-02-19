import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
import { I18NContent } from '@mode2/@types/i18nType';
import { useTranslation } from 'react-i18next';
import renderI18N from '@commonUtils/renderI18N';
import { useTeamClubRulesStore } from '@mode2/zustand/page/teamClubRulesPageStore';
import sdkUtils from '@mode2/utils/sdk';
import { Icon } from '@components/Icon';

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
}: {
  index: number;
  group: TeamClubRuleGroup;
  item: I18NContentExt;
}) => {
  const validDepositRebates = useTeamClubRulesStore(
    (state) => state.validDepositRebates
  );
  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const i18nOption = {
    i18nOption: {
      validDepositRebates: formatMoney(validDepositRebates),
      commission: formatMoney(inviteDailyRule.commission),
      dailyValidInvitees: inviteDailyRule.dailyValidInvitees,
      validInviteRebates: formatMoney(inviteDailyRule.validInviteRebates),
      productName: sdkUtils.productName(),
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
      {number === true ? <p className="mr-1">{`${index + 1}: `}</p> : null}
      <p>{renderI18N({ ...item, ...i18nOption }, t)}</p>
    </div>
  );
};

const RuleDescriptionGroup = ({ group }: { group: TeamClubRuleGroup }) => {
  return (
    <div className="flex flex-col justify-center gap-2">
      <RuleGroupTitle title={group.title} />
      {group.contents.map((item, index) => {
        return <DescriptionItem group={group} item={item} index={index} />;
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
        'flex flex-col gap-5',
        'mx-8 px-2.5 py-4',
        'bgi-border-[var(--linear-15)] border',
        'rounded-lg'
      )}
      style={{
        backgroundImage: `url(${getImgUrl(
          EResourceLevel.V,
          'background_club_my_rewards'
        )})`,
      }}
    >
      {groups.map((group) => {
        return <RuleDescriptionGroup group={group} />;
      })}
    </div>
  );
};

export default TeamClubRuleDescriptionGroups;
