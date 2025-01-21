import Modal from '@libs/mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useTranslation } from 'react-i18next';
import { useRechargeNoticeModalStore } from '@libs/mode2/zustand/components/rechargeNoticeModalStore';

import sdkUtils from '@libs/mode2/utils/sdk';
import { AppLocalStorageKey } from '@libs/mode2/utils/sdk/persistant/storageKey';
import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import useBeforeRechargeNoticeModalAction from '@mode2/action/beforeRechargeNoticeModelAction/useBeforeRechargeNoticeModalAction';
import { handleBeforeRechargeNoticeModalCloseBtnClick } from '@mode2/action/beforeRechargeNoticeModelAction/actionType';
import { useWalletPageSwitchContentTabsStore } from '@mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@mode2/@types/walletPageTabType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { cx } from '@libs/commonUtils';
import Icon from '@libs/mode2/components/Icon';

/**
 * 充值前Popup
 * @returns
 */
const RechargeNoticeModal = () => {
  const { t } = useTranslation();
  const rechargeNoticeModalVisible = useRechargeNoticeModalStore(
    (state) => state.rechargeNoticeModalVisible
  );
  const setRechargeNoticeModalVisible = useRechargeNoticeModalStore(
    (state) => state.setRechargeNoticeModalVisible
  );

  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  const { handleBeforeRechargeNoticeModalClick } =
    useBeforeRechargeNoticeModalAction();
  const [isChecked, setIsChecked] = useState(false);
  // 你想要改变颜色的文字
  const highlightedWords = [
    'Phonepe/Gpay UPI',
    'Bhim',
    'Bank',
    'Amazon',
    'Paytm UPI',
  ];
  const onClose = useCallback(() => {
    handleBeforeRechargeNoticeModalClick({
      actionName: handleBeforeRechargeNoticeModalCloseBtnClick,
      payload: { value: isChecked },
    });
  }, [isChecked]);

  useEffect(() => {
    const lastCheckTime = Number(
      sdkUtils.getStorage(AppLocalStorageKey.RECHARGE_NOTICE_POPUP)
    );
    if (lastCheckTime) {
      if (dayjs().unix() > lastCheckTime) {
        sdkUtils.removeStorage(AppLocalStorageKey.RECHARGE_NOTICE_POPUP);
        setRechargeNoticeModalVisible(
          curSwitchContentTabId === WalletPageTabType.DEPOSIT
        );
      } else {
        setRechargeNoticeModalVisible(false);
      }
    } else {
      setRechargeNoticeModalVisible(
        curSwitchContentTabId === WalletPageTabType.DEPOSIT
      );
    }

    return () => {
      setRechargeNoticeModalVisible(false);
    };
  }, [curSwitchContentTabId]);

  return rechargeNoticeModalVisible ? (
    <Modal>
      <div className="relative flex flex-col bgi-text-[var(--grayscale-100)] mobile:gap-4 gap-2 mobile:max-w-[396px] max-w-[304px] items-center">
        <div
          className="flex flex-col bgi-[var(--grayscale-100)] rounded-lg
              mobile:p-6 p-4 items-center"
        >
          <div className="flex gap-2 items-center">
            <Icon
              className="mobile:w-9 w-6 p-1"
              name="icon_notice_3"
              color="var(--base-1-main)"
            />
            <span className="bgi-text-[var(--base-1-main)] mobile:text-xl text-lg font-semibold">
              {t('game_popup_leave_title_notice')}
            </span>
          </div>
          <div className="bgi-text-[var(--grayscale-50)] mobile:text-base text-sm text-center font-medium mt-2">
            {t('wallet_deposit_bonus_pay_channel_upi_notice_upi_2')
              .split(new RegExp(`(${highlightedWords.join('|')})`, 'g'))
              .map((part, index) =>
                highlightedWords.includes(part) ? (
                  <span
                    key={index}
                    className="bgi-text-[var(--state-error-main)]"
                  >
                    {part}
                  </span>
                ) : (
                  part
                )
              )}
          </div>

          <BasePrimaryBtn
            className={cx(
              'h-auto',
              'py-1 px-4 mobile:py-2',
              'mt-2 mobile:mt-6'
            )}
            onClick={onClose}
            children={t('wallet_deposit_pay_transaction_results_btn_ok')}
          />
        </div>
        <div
          className="flex gap-2 text-base font-medium cursor-pointer"
          onClick={() => {
            setIsChecked(!isChecked);
          }}
        >
          <img
            className="w-6 h-6"
            src={getImgUrl(
              EResourceLevel.V,
              `icon_checkbox_${isChecked ? 'checked' : 'uncheck'}`
            )}
            alt="uncheck"
          />
          {t('popup_home_not_displayed_today')}
        </div>
        <button
          className="mobile:absolute mobile:top-3 mobile:right-3"
          onClick={onClose}
        >
          <Icon
            className="w-6 h-6 rounded-full border border-[var(--grayscale-100)] p-1 mobile:hidden block"
            name="ic_close"
          />

          <Icon
            className="w-6 h-6 rounded-full bgi-border-[var(--base-1-main)] p-1 mobile:block hidden"
            name="ic_close"
            color={'var(--base-1-main)'}
          />
        </button>
      </div>
    </Modal>
  ) : null;
};

export default RechargeNoticeModal;
