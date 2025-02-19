import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Checkbox from '@libs/mode2/components/Checkbox';
import {
  EResourceLevel,
  formatCountdownTime,
  getImgUrl,
} from '@libs/mode2/utils';
import Icon from '@components/Icon';
import { useTranslation } from 'react-i18next';
import useFirstChargeModalBase from '@libs/mode2/usecase/useFirstChargeModalBase';
import useFirstChargeModalAction from '@libs/mode2/action/firstChargeModalAction/useFirstChargeModalAction';
import {
  handleFirstChargeModalClose,
  handleFirstChargeModalNotShowTodayClick,
  handleFirstChargeModalToWalletClick,
} from '@libs/mode2/action/firstChargeModalAction/acitonType';

export const FirstChargeDiscountModal = () => {
  const { t } = useTranslation();
  const { handleFirstChargeModalClick } = useFirstChargeModalAction();

  const { isNotShowToday, countdownTime, isShowFirstChargeDiscountModal } =
    useFirstChargeModalBase();

  return isShowFirstChargeDiscountModal ? (
    <BaseModal>
      <div className="w-[80%] max-w-[384px] relative text-center bgi-text-[var(--grayscale-100)]">
        <div
          className="flex justify-center absolute -top-8 right-0"
          onClick={() => {
            handleFirstChargeModalClick({
              actionName: handleFirstChargeModalClose,
            });
          }}
        >
          <Icon name="ic_close" className="w-6 h-6" />
        </div>

        <img
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'first_recharge_popup')}
          alt=""
          className={cx('w-full h-auto cursor-pointer')}
          onClick={() => {
            handleFirstChargeModalClick({
              actionName: handleFirstChargeModalToWalletClick,
            });
          }}
        />

        <div className={cx('my-3 flex justify-center')}>
          <Checkbox
            checked={isNotShowToday}
            onChange={() =>
              handleFirstChargeModalClick({
                actionName: handleFirstChargeModalNotShowTodayClick,
                payload: { value: !isNotShowToday },
              })
            }
            label={t('popup_home_not_displayed_today')}
          />
        </div>

        <div className="flex items-center justify-center">
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
          <div
            className={cx(
              'text-lg mx-4 font-medium bgi-text-[var(--base-1-variant6)]'
            )}
          >
            {t('popup_home_offer_countdown')}
          </div>
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
        </div>

        <div className={cx('text-[32px] font-medium text-[#FFE81B]')}>
          {countdownTime ? formatCountdownTime(countdownTime) : ''}
        </div>
      </div>
    </BaseModal>
  ) : null;
};
