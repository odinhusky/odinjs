import Modal from '@libs/mode2/components/Modal';
import {
  handleReminderModalCloseBtnClick,
  handleReminderModalDepositNowBtnClick,
} from '@libs/mode2/action/actionTypes';
import { EResourceLevel, formatMoney, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useReminderModalStore } from '@libs/mode2/zustand/components/reminderModalStore';
import { useReminderModalAction } from '@mode2/action/reminderModalAction/useReminderModalAction';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import Icon from '@components/Icon';

/**登录/注册成功 充值popup */
export const ReminderModal = () => {
  const { t } = useTranslation();
  const { handleReminderModalClick } = useReminderModalAction();
  const isShowReminderModal = useReminderModalStore(
    (state) => state.isShowReminderModal
  );

  const registerBonus = useReminderModalStore((state) => state.registerBonus);

  return isShowReminderModal ? (
    <Modal>
      <div
        className="relative flex flex-col bgi-text-[var(--grayscale-100)] bgi-[var(--grayscale-100)]
            mobile:gap-4 gap-3
            mobile:p-6 p-4
            mobile:min-w-[251px] min-w-[235px]
            mobile:max-w-[280px] max-w-[251px]
            rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
      >
        <button
          className="absolute mobile:right-3 mobile:top-3 mobile:left-auto mobile:bottom-auto mobile:translate-x-0
              left-1/2 -translate-x-1/2 -bottom-8"
          onClick={() => {
            handleReminderModalClick({
              actionName: handleReminderModalCloseBtnClick,
            });
          }}
        >
          <Icon
            className="w-6 h-6 rounded-full bgi-border-[var(--base-1-main)] p-1 mobile:block hidden"
            name="ic_close_3"
            color={'var(--base-1-main)'}
          />

          <Icon
            className="w-6 h-6 p-1 rounded-full border border-[var(--grayscale-100)] mobile:hidden block"
            name="ic_close"
          />
        </button>
        <div className="flex gap-2 items-center">
          <img
            src={getImgUrl(EResourceLevel.V, 'popup_login_reminder')}
            alt="welcome"
          />
          <div className="mobile:text-xl text-lg bgi-text-[var(--base-1-main)] font-semibold">
            {registerBonus > 0
              ? t('sign_up_popup_bonus_title')
              : t('sign_up_popup_title_reminder')}
          </div>
        </div>
        <div className="whitespace-pre-line mobile:text-base text-sm font-medium bgi-text-[var(--grayscale-50)] text-center">
          {registerBonus > 0
            ? t('sign_up_popup_bonus_content', {
                registerBonus: formatMoney({ value: registerBonus }),
              })
            : t('sign_up_popup_content_registered_successfully')}
        </div>

        <BasePrimaryBtn
          className={cx(
            'h-auto',
            'py-1 px-4 mobile:py-2',
            'text-base mobile:text-lg'
          )}
          onClick={() => {
            handleReminderModalClick({
              actionName: handleReminderModalDepositNowBtnClick,
            });
          }}
          children={t('sign_up_popup_bonus_button')}
        />
      </div>
    </Modal>
  ) : null;
};
