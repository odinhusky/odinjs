import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import { useRechargeConfirmationModalStore } from '@mode2/zustand/components/rechargeConfirmationStore';
import { cx } from '@libs/commonUtils/cx';
import {
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';
import { useBreakPoint } from '@libs/commonUtils';
import { useRechargeConfirmationAction } from '@/action/rechargeConfirmationAction/useRechargeConfirmationAction';
import {
  handleFinishRechargeInToGameClick,
  handleLastRechargeInToGameClick,
  handleRechargeInToGameClick,
} from '@/action/rechargeConfirmationAction/acitonType';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import Icon from '@libs/mode2/components/Icon';

const StarMark = () => {
  return (
    <div
      className={cx(
        'mr-[4px] self-start text-base mobile:text-xl font-medium bgi-text-[var(--state-error-main)]'
      )}
    >
      {'*'}
    </div>
  );
};

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
  const { isMobile } = useBreakPoint();

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

  const buttonClass =
    'h-8 w-full mobile:h-[40px] text-base mt-6 mobile:mt-5 tablet:mt-6 rounded-[4px] flex items-center justify-center';
  const buttonTextClass = 'font-medium text-base mobile:text-lg';
  return (
    isShowModal && (
      <BaseModal>
        <div
          className="relative bgi-[var(--grayscale-00)] rounded-2xl
              w-[304px] mobile:w-[400px]
              bgi-border-[var(--base-1-main)] after:border-2"
        >
          {!isMobile && (
            <button
              className="absolute top-[3%] right-[4%] p-1 rounded-full"
              onClick={() => {
                handleRechargeConfirmationClick({
                  actionName: handleFinishRechargeInToGameClick,
                });
              }}
            >
              <Icon
                className="w-6 h-6 rounded-full bgi-border-[var(--base-1-main)] p-1"
                name="ic_close"
                color={'var(--base-1-main)'}
              />
            </button>
          )}
          <div
            className="relative flex gap-[10px] bgi-[var(--base-1-main)]
                py-3 px-5 rounded-t-2xl items-center overflow-hidden"
          >
            <img
              src={getImgUrl(EResourceLevel.V, 'popup_new_page')}
              alt="close"
              className="h-[40px] w-[48px] mobile:h-[56px] w-[68px]"
            />
            <div className="bgi-text-[var(--grayscale-00)] text-lg mobile:text-xl font-semibold">
              {t('wallet_popup_title_new_page')}
            </div>
            <div className="absolute -right-16 -top-32 w-60 h-60 bgi-[var(--transparent-white-10)] rounded-full" />
            <div className="absolute -right-24 -top-32 w-60 h-60 bgi-[var(--transparent-white-10)] rounded-full" />
          </div>
          <div className="pt-3 pb-4 px-5">
            <ul className="font-medium text-sm mobile:text-base bgi-text-[var(--grayscale-50)]">
              <li className="pb-2 mobile:pb-3">
                {t('wallet_popup_please_do_not_close')}
              </li>
              <li className="pb-2 mobile:pb-3">
                {t('wallet_popup_after_completing')}
              </li>
            </ul>
            <div className="flex">
              <StarMark />
              <span className="bgi-text-[var(--grayscale-30)] text-xs  mobile:text-sm font-medium">
                {t('wallet_popup_note_there_may_be')}
              </span>
            </div>
            <BasePrimaryBtn
              className={cx(
                'relative z-10 rounded-lg',
                'h-8 mobile:h-[40px] mt-3',
                'shadow-[0px_-2px_2px_0px_#FFFFFF66_inset,0px_2px_2px_0px_#FFFFFF99_inset]',
                'cursor-pointer'
              )}
              classNameText="!text-base !bgi-text-[var(--grayscale-00)] font-medium"
              onClick={() =>
                handleRechargeConfirmationClick({
                  actionName: handleRechargeInToGameClick,
                })
              }
              children={t('wallet_popup_btn_payment_successful')}
            />

            <button
              className={cx(
                buttonClass,
                buttonTextClass,
                'relative z-10 rounded-lg !mt-2',
                'bgi-[var(--grayscale-00)] bgi-text-[var(--grayscale-30)]',
                'border border-[var(--grayscale-10)]',
                'cursor-pointer'
              )}
              onClick={() => {
                // 不可以再次充值，拿上一次充值結果
                handleRechargeConfirmationClick({
                  actionName: handleLastRechargeInToGameClick,
                });
              }}
            >
              {t('wallet_popup_btn_payment_failed')}
            </button>
          </div>
          {isMobile && (
            <div className="absolute bgi-[var(--transparent-gray-50)] -top-10 -right-0.5 rounded-full overflow-hidden">
              <button
                className={cx('cursor-pointer', 'w-6 h-6 p-1')}
                onClick={() => {
                  handleRechargeConfirmationClick({
                    actionName: handleFinishRechargeInToGameClick,
                  });
                }}
              >
                <Icon className="w-full" name="ic_close" />
              </button>
            </div>
          )}
        </div>
      </BaseModal>
    )
  );
};
