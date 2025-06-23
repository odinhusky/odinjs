import BaseModal from '@libs/components/Modal';
import useLowBalanceRechargeModalStore from '@libs/mode2/zustand/modal/LowBalanceRechargeModal';
import useLowBalanceRechargeModalBase from '@libs/mode2/usecase/modal/useLowBalanceRechargeModalBase';

import { CloseBtnUnit } from '@modals/BaseModalCloseButton';
import useLowBalanceRechargeModalActions from '@mode2/action/model/LowBalanceRechargeModal/useLowBalanceRechargeModalAction';
import {
  handleLowBalanceRechargeModalCloseModalClickAction,
  handleLowBalanceRechargeModalRechargeClickAction,
} from '@libs/mode2/action/actionTypes';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { getImgUrl, EResourceLevel } from '@libs/mode2/utils';
import { cx, useMillisecondCountdown } from '@libs/commonUtils';
import { useTranslation } from 'react-i18next';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
// import { PayChannelList } from './components/PayChannelList';
import PayChannelAmountOptions from './components/PayChannelAmountOptions';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import {
  ScreenOrientationType,
  useTemplateLayoutStore,
} from '@libs/mode2/zustand/template/templateLayoutStore';

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
          'w-[80%] max-w-[384px] ',
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
        {/* 圖片的一半高度 */}
        <div className="h-[60px]"></div>
        <div
          className={cx(
            'relative',
            'p-4 box-border',
            'bgi-[var(--base-2-variant9)]',
            'border-2 border-[var(--base-1-main)] rounded-xl'
          )}
        >
          <div className={cx('flex justify-center', '-mt-20')}>
            <BaseCacheImg
              src={getImgUrl(
                EResourceLevel.POPUP_BANNER,
                'popup_comeback_bonus_mode2'
              )}
              className={cx('w-[312px] h-[120px]')}
            />
          </div>
          {/* 圖片一半高 60px + 12px */}
          <div className="h-[72px]"></div>

          {/* 提示說明 */}
          {/* <div className="text-base font-medium bgi-text-[var(--base-1-variant6)]">
            Recharge now and get a special bonus Available for the next 5
            minutes only!
          </div> */}

          <div className="max-h-[300px] pt-3 overflow-y-auto">
            <PayChannelAmountOptions />
          </div>

          {/* <PayChannelList /> */}

          {/* 提示說明 */}
          {/* <div className="text-xs font-medium my-3 bgi-text-[var(--base-2-variant2)]">
            Don't miss your comeback chance - tap "Recharge" and return
            stronger!
          </div> */}

          {/* 充值 */}
          <div className="flex justify-center mt-6">
            <BasePrimaryBtn
              className={cx('w-[196px] !h-[46px]')}
              classNameText="text-xl font-medium"
              debounceTimer={500}
              onClick={() => {
                handleLowBalanceRechargeModalClick({
                  actionName: handleLowBalanceRechargeModalRechargeClickAction,
                  payload: {
                    timeLeft: timeLeft,
                  },
                });
              }}
              children={t('deposit_alert_recharge_button')}
            />
          </div>
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
