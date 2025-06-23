import AnimationFlipNumbers from '@components/AnimationFlipNumbers';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import BaseModal from '@libs/components/Modal';
import {
  FLEX_CENTER,
  FLEX_COL,
  MOBILE_BREAK_POINT_MAX_WIDTH,
} from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useGiftCodeRedeemStore } from '@libs/mode2/zustand/page/GiftCodeRedeemPage/useGiftCodeRedeemStore';
import { useTranslation } from 'react-i18next';
import './index.scss';
import { useEffect, useState } from 'react';
import useGiftCodeRedeemPageAction from '@libs/mode2/action/giftCodeRedeemAction/useGiftCodeRedeemPageAction';
import { handleGiftCodeShowRedeemResultModal } from '@mode2/action/actionTypes';

export const GiftCodeRedeemResultModal = () => {
  const { t } = useTranslation();

  const { handleGiftCodeRedeemPageClick } = useGiftCodeRedeemPageAction();

  const showRedeemResultModal = useGiftCodeRedeemStore(
    (state) => state.showRedeemResultModal
  );
  const errorMessage = useGiftCodeRedeemStore((state) => state.errorMessage);
  const redeemAmount = useGiftCodeRedeemStore((state) => state.redeemAmount);

  const [animationFlipNumber, setAnimationFlipNumber] = useState(false);

  const handleClose = () => {
    handleGiftCodeRedeemPageClick({
      actionName: handleGiftCodeShowRedeemResultModal,
      payload: {
        value: false,
      },
    });
  };

  useEffect(() => {
    if (showRedeemResultModal) {
      setTimeout(() => {
        setAnimationFlipNumber(true);
      }, 600);
    } else {
      setAnimationFlipNumber(false);
    }
  }, [showRedeemResultModal]);

  return showRedeemResultModal ? (
    <BaseModal className="!bgi-[var(--transparent-gray-90)]">
      <div className={cx('bgi-text-[var(--grayscale-100)]')}>
        {/* 成功的style */}
        {!errorMessage ? (
          <div
            className={cx(
              MOBILE_BREAK_POINT_MAX_WIDTH,
              'w-screen h-screen',
              'animate__animated animate__popupScaleIn animate__faster'
            )}
          >
            <img
              src={getImgUrl(EResourceLevel.POPUP_BANNER, 'reward_title')}
              alt="reward_title"
              className={cx(
                MOBILE_BREAK_POINT_MAX_WIDTH,
                'w-screen px-20 absolute z-[1] top-[16%] left-1/2 -translate-x-1/2'
              )}
            />
            <div
              className="w-full h-full mt-5 relative z-10 bg-orange-500"
              style={{
                background: `url(${getImgUrl(
                  EResourceLevel.POPUP_BANNER,
                  'gift_code_success',
                  '.webp'
                )})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {animationFlipNumber ? (
                <div
                  className={cx(
                    'absolute z-10 top-[62%] left-1/2 -translate-x-1/2'
                  )}
                >
                  <div className="mb-20">
                    <AnimationFlipNumbers
                      numbers={`${redeemAmount}`}
                      height={60}
                      amountHeight={27}
                      dollarClassName="-mb-3"
                    />
                  </div>
                  <BasePrimaryBtn
                    className={cx('w-[368px] h-12 text-lg font-medium')}
                    children={t(
                      'withdrawal_bank_account_confirm_again_confirm_button'
                    )}
                    onClick={handleClose}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* 失败的style */}
        {errorMessage ? (
          <div
            className={cx(
              'w-[364px] p-8 box-border gap-8 rounded-xl',
              FLEX_CENTER,
              FLEX_COL,
              'border border-[var(--base-1-main)] bgi-[var(--base-2-variant9)]'
            )}
          >
            <div className={cx('', 'text-xl font-medium')}>
              <div>{t('profile_user_logout_reminder_title')}</div>
            </div>

            <div className="text-base font-medium">{errorMessage}</div>

            <BasePrimaryBtn
              className="w-[142px] h-[46px] text-lg font-medium"
              children={t(
                'withdrawal_bank_account_confirm_again_confirm_button'
              )}
              onClick={handleClose}
            />
          </div>
        ) : null}
      </div>
    </BaseModal>
  ) : null;
};
