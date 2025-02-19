import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { useTranslation } from 'react-i18next';
import { useRechargeStore } from '@/zustand/wallet/rechargeStore';
import cx from '@commonUtils/cx';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { isEmpty } from 'lodash';
import { handleWalletPageRechargeContentDepositBtnClick } from '@/action/walletPageAction/acitonType';
import React from 'react';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@constant/style';

export const RechargeButton = ({
  isRechargeFromGame,
}: {
  isRechargeFromGame: boolean;
}) => {
  const { handleWalletPageClick } = useWalletPageActions();
  const { t } = useTranslation();
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);
  return (
    <div
      className={cx(
        'w-screen',
        MOBILE_BREAK_POINT_MAX_WIDTH,
        '-mx-4 fixed bottom-0',
        'px-4 pt-3 pb-5',
        'bgi-[var(--base-2-variant5)]'
      )}
    >
      <BasePrimaryBtn
        className={cx('font-medium ', {
          // 'mb-[64px]': !isRechargeFromGame,
        })}
        disabled={isEmpty(rechargeAmount)}
        debounceTimer={500}
        onClick={() => {
          handleWalletPageClick({
            actionName: handleWalletPageRechargeContentDepositBtnClick,
            payload: { isRechargeFromGame },
          });
        }}
        children={t('Pay Now')}
      />
      {/*TODO i18n*/}
    </div>
  );
  // return (
  //   <AffixBottomWrapper>
  //     <div
  //       className={cx(
  //         'bgi-[var(--bg-main)] mobile:bgi-[#00000000]',
  //         'w-screen mobile:w-full',
  //         '-mx-4 mobile:-mx-0 p-4 mobile:p-0'
  //       )}
  //     >
  //       <BasePrimaryBtn
  //         className={cx('font-medium', {
  //           'mb-[64px]': !isRechargeFromGame,
  //         })}
  //         disabled={isEmpty(rechargeAmount)}
  //         debounceTimer={500}
  //         onClick={() => {
  //           handleWalletPageClick({
  //             actionName: handleWalletPageRechargeContentDepositBtnClick,
  //             payload: { isRechargeFromGame },
  //           });
  //         }}
  //         children={t('wallet_nav_deposit')}
  //       />
  //     </div>
  //   </AffixBottomWrapper>
  // );
};

export default RechargeButton;
