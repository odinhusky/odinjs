import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import Checkbox from '@libs/mode2/components/Checkbox';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import useFirstChargeModalAction from '@libs/mode2/action/firstChargeModalAction/useFirstChargeModalAction';
import {
  handleFirstChargeModalClose,
  handleFirstChargeModalNotShowTodayClick,
  handleFirstChargeModalToWalletClick,
} from '@mode2/action/actionTypes';
import { useMode2FirstChargeModalStore } from '@mode2/zustand/components/firstChargeStore';
import { BaseCacheImg } from '@mode2/components/BaseCacheImg';
import useMobileExclusiveFirstChargeModalBase from './useMobileExclusiveFirstChargeModalBase';
import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

export const FirstChargeDiscountModal = () => {
  const { t } = useTranslation();

  useMobileExclusiveFirstChargeModalBase({
    offerCountdown: 60 * 10,
  });

  const isNotShowToday = useMode2FirstChargeModalStore(
    (state) => state.isNotShowToday
  );
  const isShowFirstChargeDiscountModal = useMode2FirstChargeModalStore(
    (state) => state.isShowFirstChargeDiscountModal
  );

  const countdownTime = useMode2FirstChargeModalStore(
    (state) => state.countdownTime
  );

  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  const { handleFirstChargeModalClick } = useFirstChargeModalAction();

  const { formattedTime } = useMillisecondCountdown({
    duration: countdownTime * 1000,
    onEnd: () => console.log('Happy New Year!'),
    millisecondDigits: 2,
  });

  return isShowFirstChargeDiscountModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div className="w-[80%] max-w-[384px]  text-center bgi-text-[var(--grayscale-100)]">
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleFirstChargeModalClick({
                actionName: handleFirstChargeModalClose,
              });
            }}
          />
        </div>

        <BaseCacheImg
          className={cx('w-full h-auto cursor-pointer')}
          src={getImgUrl(EResourceLevel.POPUP_BANNER, 'first_recharge_popup')}
          imgName="first_recharge_popup"
          alt={'first_recharge_popup'}
          onClick={(e) => {
            handleFirstChargeModalClick({
              actionName: handleFirstChargeModalToWalletClick,
            });
          }}
          onLoad={() => {}}
          onError={(e) => {}}
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
            label={t('home_popup_donot_show_again')}
            checkName={getImgUrl(EResourceLevel.ICONS, 'ic_check_box')}
            uncheckName={getImgUrl(
              EResourceLevel.ICONS,
              'ic_check_box_unchecked'
            )}
          />
        </div>

        <div className="flex items-center justify-center">
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
          <div
            className={cx(
              'text-lg mx-4 font-medium bgi-text-[var(--base-1-variant6)]'
            )}
          >
            {t('home_popup_countdown')}
          </div>
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
        </div>

        <div className={cx('text-[32px] font-medium text-[#FFE81B]')}>
          {formattedTime}
        </div>
      </div>
    </BaseModal>
  ) : null;
};
