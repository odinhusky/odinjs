import { handleTeamClubSharesInviteYourFriendsButtonClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { SocialList } from '@components/SocialList';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import { SocialScenarios } from '@libs/mode2/zustand/components/socialListStore';
import { useTranslation } from 'react-i18next';

export const TeamClubShare = () => {
  const { t } = useTranslation();

  const { handleTeamClubClick } = useTeamClubAction();

  return (
    <div
      className={cx(
        'w-full',
        FLEX_COL,
        'gap-2',
        'bgi-[var(--linear-1)]',
        'border bgi-border-[var(--base-1-light)] after-rounded-lg rounded-lg',
        'p-2'
      )}
    >
      {/* 邀請按鈕 */}
      <BasePrimaryBtn
        className={cx('rounded-full h-9', 'relative z-[1]')}
        onClick={() => {
          handleTeamClubClick({
            actionName: handleTeamClubSharesInviteYourFriendsButtonClick,
          });
        }}
        children={
          // <div className={cx(FLEX_ITEMS_CENTER, 'gap-2')}>
          //   <Icon name="ic_link" className={cx('w-6 h-6')} />
          //
          //   <span className={cx('text-sm', 'bgi-text-[var(--grayscale-100)]')}>
          //     {t('earn_my_rewards_invite')}
          //   </span>
          // </div>

          <span
            className={cx(
              'text-sm font-semibold',
              'bgi-text-[var(--grayscale-100)]'
            )}
          >
            {t('earn_my_rewards_invite')}
          </span>
        }
      />

      <SocialList
        className={cx('gap-2', 'relative z-[1]')}
        iconClassName={'w-5 h-5'}
        classNameLabel={'!se:text-sm !text-xs'}
        classNameUnit={cx(
          'bgi-[var(--transparent-white-10)]',
          'p-1',
          'rounded-lg'
        )}
        scenarios={SocialScenarios.TEAM_CLUB}
      />

      {/* 分隔線 */}
      {/*<div*/}
      {/*  className={cx('w-full h-px', 'bgi-[var(--transparent-white-10)]')}*/}
      {/*></div>*/}
    </div>
  );
};

export default TeamClubShare;
