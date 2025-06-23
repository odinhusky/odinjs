import React, { useEffect, useState } from 'react';
import { cx } from '@libs/commonUtils';
import renderI18N from '@libs/commonUtils/renderI18N';
import { useTranslation } from 'react-i18next';
import { countDownManager } from '@libs/commonUtils/hooks/useCountDown';
import { useOTPCountDownStore } from '@libs/mode2/zustand/components/OTPCountDownStore';
import { usePostSendOtpMutation } from '@libs/mode2/external/api';
import { useMessageStore } from '@libs/mode2/zustand/components/messageStore';
import { useDebounceAction } from '@libs/mode2/action/common/handleAction';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { OTPCountDownProps } from '../OTPCountDownProps';

export const OTPCountDown = ({
  className,
  btnClassName,
  classNameText,
  currentKey,
  duration,
  mobile,
  getMobileFn,
  i18nKey = 'toast_the_verification_code',
  showUnit = true,
}: OTPCountDownProps) => {
  const { t } = useTranslation();

  const sizeClass = cx('h-7 px-4');

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

  const isCounting = remainSec && remainSec > 0;

  return isCounting ? (
    <div
      className={cx(
        sizeClass,
        'bgi-[var(--grayscale-20)]',
        'bgi-text-[var(--grayscale-100)]',
        className
      )}
    >
      {remainSec}
      {showUnit ? 's' : ''}
    </div>
  ) : (
    <div className={cx(sizeClass, className)}>
      <BaseSecondaryBtn
        className={cx(sizeClass, btnClassName, 'text-sm')}
        classNameText={cx(classNameText)}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        children={
          <div>
            {renderI18N({ i18nKey: 'sign_in_popup_new_password_btn_send' }, t)}
          </div>
        }
      />
    </div>
  );
};

export default OTPCountDown;
