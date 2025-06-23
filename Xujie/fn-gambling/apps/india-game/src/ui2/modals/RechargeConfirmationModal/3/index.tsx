import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from '@mode2/components/Modal';
import { useRechargeConfirmationModalStore } from '@mode2/zustand/components/rechargeConfirmationStore';
import { cx } from '@libs/commonUtils/cx';
import {
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { useRechargeConfirmationAction } from '@/action/rechargeConfirmationAction/useRechargeConfirmationAction';
import {
  handleFinishRechargeInToGameClick,
  handleLastRechargeInToGameClick,
  handleRechargeInToGameClick,
} from '@mode2/action/actionTypes';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@components/Icon';
import BaseSecondaryBtn from '@components/BaseSecondaryBtn';
import { useMode2WebviewPageStore } from '@mode2/zustand/page/webviewPageStore';

/**
 * 充值結果確認視窗
 *
 * - 點選充值成功 => 先打API確認後, 如果結果成功會返回進入充值前頁面,如果結果失敗會再次開啟充值頁面
 * - 點選充值失敗 => 直接返回充值畫面（可能是內開或外開的頁面）
 */
export const RechargeConfirmationModal = () => {
  const { t } = useTranslation();
  const { isShowRechargeConfirmationModal } =
    useRechargeConfirmationModalStore();
  const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);

  const { handleRechargeConfirmationClick } = useRechargeConfirmationAction();

  // 避免內開支付頁面被設定成fixed的Modal覆蓋
  const isShowModal =
    isShowRechargeConfirmationModal &&
    rechargeStatus !== RechargeStatusResult.INTERNAL;

  useEffect(() => {
    return () => {
      handleRechargeConfirmationClick({
        actionName: handleFinishRechargeInToGameClick,
      });
    };
  }, []);

  return (
    isShowModal && (
      <BaseModal>
        <div className="relative bgi-[var(--base-2-variant9)] rounded-lg p-4 pt-3 w-[364px] border-2 border-[var(--base-1-main)]">
          <button
            className="absolute top-3 right-3"
            onClick={() => {
              useMode2WebviewPageStore
                .getState()
                .setWebViewPageHeaderShow(true);
              handleRechargeConfirmationClick({
                actionName: handleFinishRechargeInToGameClick,
              });
            }}
          >
            <Icon className="w-6 h-6" name="ic_close" />
          </button>

          {/* title */}
          <div
            className={cx(
              'text-lg font-medium w-full flex justify-center bgi-text-[var(--grayscale-100)]',
              'py-3 border-b border-[var(--transparent-white-10)]'
            )}
          >
            <div className="w-4/5 text-center ">
              {t('wallet_popup_title_new_page')}
            </div>
          </div>

          {/* content */}
          <ul className="my-8 text-sm font-normal bgi-text-[var(--grayscale-100)] list-disc pl-4">
            <li className="">{t('wallet_popup_please_do_not_close')}</li>
            <li className="">{t('wallet_popup_after_completing')}</li>
            <li className="">{t('wallet_popup_third_content_new_page')}</li>
          </ul>

          <BaseSecondaryBtn
            className={cx('h-12 text-lg font-medium mb-6')}
            onClick={() =>
              handleRechargeConfirmationClick({
                actionName: handleRechargeInToGameClick,
              })
            }
            children={t('wallet_popup_btn_payment_successful')}
          />

          <BasePrimaryBtn
            className={cx('h-12 text-lg font-medium')}
            onClick={() => {
              // 不可以再次充值，拿上一次充值結果
              handleRechargeConfirmationClick({
                actionName: handleLastRechargeInToGameClick,
              });
            }}
          >
            {t('wallet_popup_btn_payment_failed')}
          </BasePrimaryBtn>
        </div>
      </BaseModal>
    )
  );
};
