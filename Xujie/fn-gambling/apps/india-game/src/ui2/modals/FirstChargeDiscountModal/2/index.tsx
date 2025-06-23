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
} from '@mode2/action/actionTypes';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';

export const FirstChargeDiscountModal = () => {
  const { t } = useTranslation();

  useFirstChargeModalBase();

  const isNotShowToday = useMode2FirstChargeModalStore(
    (state) => state.isNotShowToday
  );
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );

  const countdownTime = useMode2FirstChargeModalStore(
    (state) => state.countdownTime
  );

  const { handleFirstChargeModalClick } = useFirstChargeModalAction();

  return isShowFirstChargeDiscountModal ? (
    <BaseModal>
      <div className="relative text-center bgi-text-[var(--grayscale-100)]">
        <div className="flex justify-center absolute -top-8 right-0">
          <button
            className={cx(
              'flex justify-center items-center cursor-pointer h-6 w-6 p-1 rounded-full border border-solid z-[2] border-white'
            )}
            onClick={() => {
              handleFirstChargeModalClick({
                actionName: handleFirstChargeModalClose,
              });
            }}
          >
            <Icon name="ic_close" className="w-6 h-6" />
          </button>
        </div>

        {/*<img*/}
        {/*  src={getImgUrl(EResourceLevel.POPUP_BANNER, 'first_recharge_popup')}*/}
        {/*  alt=""*/}
        {/*  className={cx('w-[328px] h-[408px] cursor-pointer')}*/}
        {/*  onClick={() => {*/}
        {/*    handleFirstChargeModalClick({*/}
        {/*      actionName: handleFirstChargeModalToWalletClick,*/}
        {/*    });*/}
        {/*  }}*/}
        {/*/>*/}
        <BaseCacheImg
          className={cx('w-[328px] h-[408px] cursor-pointer')}
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'first_recharge_popup')}
          imgName="first_recharge_popup"
          alt={'first_recharge_popup'}
          onClick={(e) => {
            handleFirstChargeModalClick({
              actionName: handleFirstChargeModalToWalletClick,
            });
          }}
        />

        <div className={cx('my-2 flex justify-center')}>
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

        <div
          className={cx('text-base font-extrabold text-[#FFE81B] leading-5')}
        >
          {t('popup_home_offer_countdown')}
        </div>
        <div className={cx(' text-[32px] font-extrabold text-[#FFE81B]')}>
          {countdownTime ? formatCountdownTime(countdownTime) : ''}
        </div>
      </div>
    </BaseModal>
  ) : null;
};
