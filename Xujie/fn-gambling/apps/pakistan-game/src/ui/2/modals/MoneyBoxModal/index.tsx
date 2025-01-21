import { useEffect } from 'react';
import BaseModal from '@mode2/components/Modal';
import { EResourceLevel, formatMoney } from '@mode2/utils';
import { usePostPiggyBankDetailMutation } from '@mode2API/index';
import { useRebateRewardModalStore } from '@mode2/zustand/components/rebateRewardModalStore';
import useRebateRewardModalAction from '@mode2/action/rebateRewardModalAction/useRebateRewardModalAction';
import { handleCollectRewardBtnClick } from '@mode2/action/rebateRewardModalAction/actionType';
import { useTranslation } from 'react-i18next';
import { useImgUrlByBreakPoint } from '@libs/commonUtils';
import Icon from '@mode2/components/Icon';
import sdkUtils from '@mode2/utils/sdk';

/** 存錢罐 */
export const MoneyBoxModal = () => {
  const { isShowRebateRewardModal, setIsShowRebateRewardModal } =
    useRebateRewardModalStore();
  const { t } = useTranslation();
  const { handleRebateRewardModalClick } = useRebateRewardModalAction();
  const { getImgUrlByBreakPoint } = useImgUrlByBreakPoint();

  const currentCash = useRebateRewardModalStore((state) => state.currentCash);
  const setCurrentCash = useRebateRewardModalStore(
    (state) => state.setCurrentCash
  );

  const [postPiggyBankDetail, { data: piggyBankDetail }] =
    usePostPiggyBankDetailMutation();

  useEffect(() => {
    if (piggyBankDetail) {
      setCurrentCash(piggyBankDetail.amount);
    }
  }, [piggyBankDetail]);

  useEffect(() => {
    if (sdkUtils.isCurrentLogin()) {
      postPiggyBankDetail();
    }
    return () => {
      setIsShowRebateRewardModal(false);
    };
  }, []);

  return isShowRebateRewardModal ? (
    <BaseModal>
      <div className="relative max-w-[400px] w-[80%] bgi-[var(--base-1-main)] bgi-text-[var(--grayscale-100)] text-center mobile:pt-10 mobile:px-6 mobile:pb-6 p-4 rounded-lg">
        <img
          className="absolute w-full top-0 left-1/2 -translate-x-1/2"
          src={getImgUrlByBreakPoint(
            'popup_cashback',
            EResourceLevel.POPUP_BANNER,
            false,
            true
          )}
          alt="popup_cashback"
        />
        <Icon
          className="absolute w-6 h-6 top-[3%] right-[4%] p-1 opacity-70
              border border-[var(--transparent-white-70)] rounded-full cursor-pointer"
          name={'ic_close'}
          onClick={() => {
            setIsShowRebateRewardModal(false);
          }}
        />
        <button
          className="flex z-[100] sticky inline-block flex-col items-center
              bgi-[var(--base-3-main)] hover:bgi-[var(--base-3-light)] active:bgi-[var(--base-3-dark)]
              text-center mt-[57%] mx-auto py-1 px-4 rounded
              shadow-[var(0px_4px_4px_0px_#cccccc40_inset,0px_-4px_4px_0px_#33333340_inset)]"
          onClick={() =>
            handleRebateRewardModalClick({
              actionName: handleCollectRewardBtnClick,
              payload: { currentCash },
            })
          }
        >
          <div className="text-base font-medium">
            {t('activity_popup_cashback_btn_cash')}
            {formatMoney(currentCash, true)}
          </div>
          <div className="text-lg font-semibold">
            {t('activity_popup_cashback_btn_collect')}
          </div>
        </button>

        <div className="flex flex-col gap-2 mobile:text-base text-sm text-left mobile:mt-6 mt-3 font-medium">
          <div>{t('activity_popup_cashback_cashback_content_1')}</div>
          <div>{t('activity_popup_cashback_cashback_content_2')}</div>
          <div>{t('activity_popup_cashback_cashback_content_3')}</div>
          <div>{t('activity_popup_cashback_cashback_content_4')}</div>
        </div>
      </div>
    </BaseModal>
  ) : null;
};
