import React, { useEffect, useState } from 'react';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';
import { countDownManager } from '@libs/commonUtils/hooks/useCountDown';
import {
  OTPCountDownKeys,
  useOTPCountDownStore,
} from '@libs/mode2/zustand/components/OTPCountDownStore';
import { usePostSendOtpMutation } from '@libs/mode2/external/api';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';

export const OTPCountDown = ({
  className,
  currentKey,
  duration,
  mobile,
  getMobileFn,
  i18nKey = 'toast_the_verification_code',
}: {
  className?: string;
  currentKey: OTPCountDownKeys;
  duration?: number;
  mobile?: string;
  getMobileFn?: () => string;
  i18nKey?: string;
}) => {
  const { t } = useTranslation();

  const remainSec = useOTPCountDownStore(
    (state) => state.countDowns[currentKey]
  );
  const setOtpId = useOTPCountDownStore((state) => state.setOtpId);

  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);

  const [postSendOtp, { data: sendOtpData }] = usePostSendOtpMutation();

  useEffect(() => {
    return () => {
      if (isCountingDown) {
        setIsCountingDown(false);
      }
    };
  }, [isCountingDown]);

  const handleSendOtpClick = () => {
    console.log('[OTPCountDownManager] handleSendOtpClick', isCountingDown);
    if (isCountingDown) {
      return;
    }

    const mobilePhone =
      getMobileFn instanceof Function ? getMobileFn() : mobile;

    if (!mobilePhone) {
      console.log('[OTPCountDownManager] isValidator');
      useMessageStore.getState().info(t('toast_mobile_phone_cannot_be_empty'));
      return;
    }

    postSendOtp({ mobile: mobilePhone || '' });
  };

  useEffect(() => {
    if (sendOtpData?.otpId) {
      useMessageStore.getState().info(t(i18nKey));
      handleStartCountdown();
      setOtpId(sendOtpData?.otpId);
    }
  }, [sendOtpData]);

  const handleStartCountdown = () => {
    // if (!currentKey) {
    //   console.log('[CountDownManager] no currentKey');
    //   return;
    // }
    if (!isCountingDown) {
      setIsCountingDown(true);
    }
    if (!remainSec) {
      countDownManager.subscribe({
        key: currentKey,
        duration: duration || 60,
        onEnd: () => {
          console.log('[CountDownManager] Countdown finished!');
          setIsCountingDown(false);
        },
      });
    }
  };

  const handleClick = useDebounceAction(handleSendOtpClick, 500);

  return (
    <div
      className={cx(
        'h-7 px-4',
        'rounded bgi-text-[var(--grayscale-100)] bgi-[var(--base-2-main)]',
        'hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)] disabled:bgi-[var(--grayscale-25)]',
        { 'bgi-[var(--grayscale-20)]': remainSec && remainSec > 0 },
        className
      )}
    >
      <div
        className={cx('w-full h-full text-sm flex justify-center items-center')}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
      >
        {remainSec && remainSec > 0 ? (
          <div>{remainSec}s</div>
        ) : (
          <div>
            {renderI18N({ i18nKey: 'sign_in_popup_new_password_btn_send' }, t)}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPCountDown;
