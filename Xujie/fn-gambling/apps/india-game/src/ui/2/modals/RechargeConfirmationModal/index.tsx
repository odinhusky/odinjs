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
import Icon from '@components/Icon';

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
        <div className="relative bgi-[var(--grayscale-100)] rounded-lg p-4 mobile:p-6 w-[328px] mobile:w-[400px]">
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
          <div className="flex items-center mb-6 mobile:mb-4 pr-6">
            <img
              src={getImgUrl(EResourceLevel.V, 'popup_new_page')}
              alt="close"
              className="h-[40px] w-[48px] mobile:h-[56px] w-[68px]"
            />
            <div className="h-[48px] mobile:h-[56px] ml-2 bgi-text-[var(--base-1-main)] text-lg mobile:text-xl font-semibold">
              {t('wallet_popup_title_new_page')}
            </div>
          </div>
          <ul className="font-medium text-sm mobile:text-base bgi-text-[var(--grayscale-50)] list-disc pl-4 mobile:pl-6">
            <li className="pb-2 mobile:pb-3">
              {t('wallet_popup_please_do_not_close')}
            </li>
            <li className="pb-2 mobile:pb-3">
              {t('wallet_popup_after_completing')}
            </li>
          </ul>
          <div className="flex">
            <StarMark />
            <span className="bgi-text-[var(--grayscale-70)] text-xs  mobile:text-sm ">
              {t('wallet_popup_note_there_may_be')}
            </span>
          </div>
          <BasePrimaryBtn
            className={cx(
              'h-8 mobile:h-[40px]',
              'mt-6 mobile:mt-5 tablet:mt-6'
            )}
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
              'bgi-[var(--grayscale-100)] bgi-text-[var(--base-1-main)] border-[var(--base-1-main)] mt-[8px] mobile:mt-[12px]'
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
          {isMobile && (
            <div className="absolute w-full left-0 flex justify-center -bottom-[32px]">
              <button
                className={cx(
                  'cursor-pointer',
                  'w-6 h-6 p-1 border border-[var(--grayscale-100)] rounded-full opacity-70'
                )}
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
