import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletPageStore } from '@mode2/zustand/page/WalletPage/walletPageStore';
import { useDeepEffect } from '@libs/commonUtils';
import { useToastStore } from '@mode2/zustand/components/toastStore';
import InfoModal from '@modals/InfoModal';

// TODO i18n
export const WithdrawSuccessModal = () => {
  const { t } = useTranslation();

  const withdrawalsState = useWalletPageStore(
    (state) => state.withdrawalsState
  );

  // TODO Evan Toast 壓不住 Modal
  useDeepEffect(() => {
    if (withdrawalsState) {
      useToastStore.getState().showToast('Withdrawal initiated successfully');
    }
  }, [withdrawalsState]);

  return (
    <InfoModal
      isShow={withdrawalsState}
      content={t(
        'The withdrawal request has been submitted and is expected to arrive within 24 hours.'
      )}
      onConfirmClick={() => {
        useWalletPageStore.getState().setWithdrawalsState(false);
      }}
    />
  );

  // return withdrawalsState ? (
  //   <Modal>
  //     <div
  //       className={cx(
  //         'relative flex flex-col bgi-[var(--bg-main)] w-full h-full',
  //         MOBILE_BREAK_POINT_MAX_WIDTH,
  //         'flex-col justify-center items-center'
  //       )}
  //     >
  //       <div className="w-full flex flex-col justify-center items-center gap-6 text-sm font-medium bgi-text-[var(--base-2-variant1)] text-center">
  //         <div className={'relative w-full'}>
  //           <img
  //             className={'w-[297px] h-[297px] m-auto'}
  //             alt={'withdrawal_success'}
  //             src={getImgUrl(EResourceLevel.V, 'withdrawal_success')}
  //           />
  //           <div className="absolute top-0 left-0 right-0 top-4 w-full max-w-[750px] m-auto py-1  bgi-[var(--transparent-gray-80)] text-center text-sm font-medium bgi-text-[var(--grayscale-100)]">
  //             {t('Withdrawal initiated successfully')}
  //           </div>
  //         </div>
  //
  //         <p className={'w-[350px]'}>
  //           {t(
  //             'The withdrawal request has been submitted and is expected to arrive within 24 hours.'
  //           )}
  //         </p>
  //
  //         <BasePrimaryBtn
  //           className={cx('font-medium mt-[124px] w-auto px-[50px] text-base', {
  //             // 'mb-[64px]': !isRechargeFromGame,
  //           })}
  //           // disabled={isEmpty(rechargeAmount)}
  //           debounceTimer={500}
  //           onClick={() => {
  //             useWalletPageStore.getState().setWithdrawalsState(false);
  //           }}
  //           children={t('Confirm')}
  //         />
  //       </div>
  //     </div>
  //   </Modal>
  // ) : null;
};

export default WithdrawSuccessModal;
