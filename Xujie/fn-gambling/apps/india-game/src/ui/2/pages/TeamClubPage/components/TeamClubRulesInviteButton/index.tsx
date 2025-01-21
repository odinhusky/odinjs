import { handleTeamClubRulesInviteButtonClick } from '@/action/teamClub/acitonType';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import React from 'react';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';

export const TeamClubRulesInviteButton = () => {
  const { handleTeamClubClick } = useTeamClubAction();
  const { t } = useTranslation();
  const bottomOffset = -3;

  return (
    <AffixBottomWrapper
      notAffixContainerClass="pb-8"
      affixContainerClass="bgi-[var(--bg-main)]"
      hasBottomNav
      offset={bottomOffset}
    >
      <div className={cx('px-4 py-2')}>
        <BasePrimaryBtn
          className={cx('relative', 'z-[2]', 'h-8')}
          classNameText={cx('text-base')}
          onClick={() => {
            handleTeamClubClick({
              actionName: handleTeamClubRulesInviteButtonClick,
            });
          }}
          children={<>{t('earn_rules_invite_button')}</>}
        />
      </div>
    </AffixBottomWrapper>
  );
};

export default TeamClubRulesInviteButton;
