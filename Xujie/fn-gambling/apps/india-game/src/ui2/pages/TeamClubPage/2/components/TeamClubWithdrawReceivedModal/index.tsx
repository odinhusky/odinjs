import { handleTeamClubWithDrawReceivedOKButtonClick } from '@mode2/action/actionTypes';
import { useTeamClubAction } from '@/action/teamClub/useTeamClubAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTeamClubWithDrawStore } from '@libs/mode2/zustand/components/myRewardsContent';
import { useTranslation } from 'react-i18next';

export const TeamClubWithdrawReceivedModal = () => {
  const { t } = useTranslation();
  const { handleTeamClubClick } = useTeamClubAction();

  const isShowReceivedModal = useTeamClubWithDrawStore(
    (state) => state.isShowReceivedModal
  );

  return isShowReceivedModal ? (
    <BaseModal
      children={
        <div
          className={cx(
            'w-[328px] h-auto p-4',
            'bgi-[var(--linear-9-main)]',
            'border bgi-border-[var(--grayscale-50)]',
            'after-rounded-lg rounded-lg',
            FLEX_COL,
            'gap-3'
          )}
        >
          <div className={cx(FLEX_CENTER, 'w-full')}>
            <img
              src={getImgUrl(EResourceLevel.V, 'my_rewards_popup_claim')}
              alt=""
              className="block w-[296px]"
            />
          </div>

          <div>
            <h4
              className={cx(
                'bgi-text-[var(--grayscale-100)]',
                'text-lg font-semibold',
                'text-center'
              )}
            >
              {t('earn_my_rewards_claim_popup_title')}
            </h4>
            <span
              className={cx(
                'block w-full',
                'bgi-text-[var(--grayscale-100)]',
                'text-sm font-medium',
                'text-center'
              )}
            >
              {t('earn_my_rewards_claim_popup_content')}
            </span>
          </div>

          <div>
            <BasePrimaryBtn
              classNameText={cx('text-base')}
              children={<>{t('earn_my_rewards_claim_popup_button')}</>}
              onClick={() => {
                handleTeamClubClick({
                  actionName: handleTeamClubWithDrawReceivedOKButtonClick,
                });
              }}
            />
          </div>
        </div>
      }
    />
  ) : null;
};

export default TeamClubWithdrawReceivedModal;
