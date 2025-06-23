import {
  handleSharePagePostTgClick,
  handleSharePagePostWhatsAppClick,
  handleTeamClubSharesInviteYourFriendsButtonClick,
} from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import { SocialUnitImageType } from '@libs/mode2/zustand/components/socialListStore';
import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';
import Icon from '@components/Icon';
import { SocialList } from '@components/SocialList';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL, FLEX_ITEMS_CENTER } from '@libs/constant/style';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { useTranslation } from 'react-i18next';
import { getImgUrl, EResourceLevel, formatMoney } from '@libs/mode2/utils';
import { useUserProfileStore } from '@libs/mode2/zustand/user/userProfileStore';
import { useMemo } from 'react';
import { useTeamClubRulesStore } from '@libs/mode2/zustand/page/teamClubRulesPageStore';
import useSharePageAction from '@libs/mode2/action/sharePageAction/useSharePageAction';

export const TeamClubShare = () => {
  const { t } = useTranslation();

  const { handleTeamClubClick } = useTeamClubAction();
  const { handleSharePageClick } = useSharePageAction();

  const inviteDailyRule = useTeamClubRulesStore(
    (state) => state.inviteDailyRule
  );
  const referralLink = useUserProfileStore((state) => state.referralLink);
  const referralCode = useUserProfileStore((state) => state.referralCode);

  const shareText = useMemo(() => {
    const teamClubCommission = formatMoney({
      value: inviteDailyRule.commission,
    });
    const teamClubRebate = formatMoney({
      value: inviteDailyRule.validInviteRebates,
    });

    return `Your friend has sent you ${teamClubCommission}. Claim an additional ${teamClubRebate} with your first deposit.Claim now by clicking this link ${referralLink} and enter the referral code: ${referralCode}`;
  }, [inviteDailyRule, referralLink, referralCode]);

  return (
    <div className={cx('w-full', FLEX_COL, 'gap-3')}>
      {/* 邀請按鈕 */}
      <BasePrimaryOutlineBtn
        className={cx('h-[54px]', 'relative z-[1]')}
        onClick={() => {
          handleTeamClubClick({
            actionName: handleTeamClubSharesInviteYourFriendsButtonClick,
          });
        }}
        children={
          <div className={cx(FLEX_ITEMS_CENTER, 'gap-[18px]')}>
            <Icon name="ic_share_1" className={cx('w-6 h-6')} />

            <span className="text-base font-medium">
              {t('earn_my_rewards_invite')}
            </span>
          </div>
        }
      />

      <SocialList
        className={cx('gap-2', 'relative z-[1]', 'gap-[28px]')}
        iconClassName={cx('w-[37px] h-[37px]', 'gap-1')}
        iconOuterClassName={cx(FLEX_CENTER)}
        classNameLabel={cx(
          '!text-sm font-medium',
          'bgi-text-[var(--transparent-white-70)]',
          'block'
        )}
        classNameUnit={cx(
          'w-[89px]',
          'bgi-[var(--transparent-white-10)]',
          'px-1 py-[11.5px]',
          'block',
          'rounded-[6px]'
        )}
        isShowLabel={true}
        srcType={SocialUnitImageType.COLOR}
        scenarios={SocialScenarios.NOTHING}
        extraList={[
          {
            label: 'Whatsapp',
            icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_whatsapp'),
            onActionClick: () => {
              handleSharePageClick({
                actionName: handleSharePagePostWhatsAppClick,
                payload: {
                  postLinkText: shareText,
                },
              });
            },
          },
          {
            label: 'Telegram',
            icon: getImgUrl(EResourceLevel.SHARED, 'social/icon_telegram'),
            onActionClick: () => {
              handleSharePageClick({
                actionName: handleSharePagePostTgClick,
                payload: {
                  postLinkText: shareText,
                },
              });
            },
          },
        ]}
      />
    </div>
  );
};

export default TeamClubShare;
