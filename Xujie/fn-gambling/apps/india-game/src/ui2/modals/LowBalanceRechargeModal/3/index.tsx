import BaseModal from '@libs/components/Modal';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import useLowBalanceRechargeModalBase from '@libs/mode2/usecase/modal/useLowBalanceRechargeModalBase';

import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import useLowBalanceRechargeModalActions from '@mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';
import { handleLowBalanceRechargeModalCloseModalClickAction } from '@libs/mode2/action/actionTypes';
import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';
import { getImgUrl, EResourceLevel } from '@libs/mode2/utils';
import PayChannelAmountOptions from './components/PayChannelAmountOptions';

export const LowBalanceRechargeModal = () => {
  useLowBalanceRechargeModalBase();

  const { handleLowBalanceRechargeModalClick } =
    useLowBalanceRechargeModalActions();

  const { t } = useTranslation();

  const isShowLowBalanceRechargeModal = useLowBalanceRechargeModalStore(
    (state) => state.isShowLowBalanceRechargeModal
  );

  const lowBalanceRechargeLimitedOffersEndTime =
    useLowBalanceRechargeModalStore(
      (state) => state.lowBalanceRechargeLimitedOffersEndTime
    );

  const screenOrientation = useTemplateLayoutStore(
    (state) => state.screenOrientation
  );

  const countdownTime = useMemo(() => {
    const nowUnix = dayjs().unix();
    return lowBalanceRechargeLimitedOffersEndTime > nowUnix
      ? (lowBalanceRechargeLimitedOffersEndTime - nowUnix) * 1000
      : 0;
  }, [lowBalanceRechargeLimitedOffersEndTime]);

  const { formattedTime, timeLeft } = useMillisecondCountdown({
    duration: countdownTime,
    onEnd: () => {
      console.log('Happy New Year!');
    },
    millisecondDigits: 3,
  });

  return isShowLowBalanceRechargeModal ? (
    <BaseModal
      className={cx('!bgi-[var(--transparent-gray-90)]', {
        '!justify-start pt-20':
          screenOrientation === ScreenOrientationType.Portrait,
      })}
    >
      <div
        className={cx(
          'w-[80%] max-w-[384px]',
          'text-center bgi-text-[var(--grayscale-100)]',
          'flex  flex-col justify-start'
        )}
      >
        <div className="w-full flex justify-end items-end mb-4 ">
          <CloseBtnUnit
            customClass="!border-none w-9 h-9 !p-0 rounded-none"
            onClose={() => {
              handleLowBalanceRechargeModalClick({
                actionName: handleLowBalanceRechargeModalCloseModalClickAction,
              });
            }}
          />
        </div>

        {/* 充值 */}
        <div
          className={cx(
            'w-full h-[480px] p-6 box-border',
            'flex flex-col justify-end'
          )}
          style={{
            backgroundImage: `url(${getImgUrl(
              EResourceLevel.POPUP_BANNER,
              'popup_comeback_bonus_mode3'
            )})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <PayChannelAmountOptions timeLeft={timeLeft} />
        </div>

        {/* 倒計時 */}
        <div className="flex items-center justify-center">
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
          <div
            className={cx(
              'text-lg mx-4 my-3 font-medium bgi-text-[var(--base-1-variant6)]'
            )}
          >
            {t('home_popup_countdown')}
          </div>
          <p className="w-8 h-0.5 bgi-[var(--base-1-variant6)]"></p>
        </div>

        <div
          className={cx(
            'text-[32px] font-medium bgi-text-[var(--base-1-variant6)]'
          )}
        >
          {formattedTime}
        </div>
      </div>
    </BaseModal>
  ) : null;
};

export default LowBalanceRechargeModal;
