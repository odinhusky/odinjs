import { handleTeamClubRulesInviteButtonClick } from '@/action/teamClub/acitonType';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import React from 'react';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import { EResourceLevel, getImgUrl } from '@mode2/utils';

export const TeamClubRulesInviteButton = () => {
  const { handleTeamClubClick } = useTeamClubAction();
  const { t } = useTranslation();
  const bottomOffset = -3;

  return (
    <AffixBottomWrapper
      notAffixContainerClass=""
      affixContainerClass="pb-8"
      hasBottomNav
      offset={bottomOffset}
    >
      <div className="relative">
        <img
          className="h-10 object-contain m-auto absolute top-0 bottom-0 left-0 right-0"
          alt={'button_club'}
          src={getImgUrl(EResourceLevel.V, 'button_club')}
        />
        <BasePrimaryBtn
          className={cx(
            'relative',
            'z-[2]',
            ' p-0 w-auto m-auto',
            'bg-transparent bgi-[#FFFFFF00]'
          )}
          classNameText={cx('!bgi-text-[var(--base-1-main)] font-bold text-lg')}
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
