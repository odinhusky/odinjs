import React from 'react';
import cx from '@commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageRechargeContentDepositBtnClick } from '@/action/walletPageAction/acitonType';
import { PayChannelList } from '@components/PayChannelList';
import { RechargeCardDescription } from '@components/RechargeCardDescription';
import {
  RechargeStatusResult,
  useRechargeStore,
} from '@/zustand/wallet/rechargeStore';

import { useTranslation } from 'react-i18next';
import useRechargeContentBase from '@/ui/hooks/components/rechargeContent/useRechargeContentBase';
import StarMark from '@components/StarMark';
import { InternalPayContent } from '@/components/InternalPayContent';
import CustomizeCheckoutPage from '@pages/CustomizeCheckoutPage';
import { WalletRechargeCardSelect } from './WalletRechargeCardSelect';
import WalletRechargeInput from '@components/WalletRechargeInput';
import RechargeNoticeModal from '@modals/RechargeNoticeModal';
import { PayChannelAmountOptions } from '@components/PayChannelAmountOptions';
import { isEmpty } from 'lodash';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';

export const RechargeContent = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  useRechargeContentBase({ isRechargeFromGame });

  const { t } = useTranslation();

  const { handleWalletPageClick } = useWalletPageActions();
  /* 連動當前通道 最大最小充值金額 */
  const rechargeLimitStr = useWalletPageRechargeContentStore(
    (state) => state.rechargeLimitStr
  );

  const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);

  if (isRechargeFromGame) {
    if (rechargeStatus === RechargeStatusResult.INTERNAL) {
      return <InternalPayContent id={'pay-iframe'} title={'pay iframe'} />;
    } else if (rechargeStatus === RechargeStatusResult.CUSTOMIZED) {
      return <CustomizeCheckoutPage />;
    }
  }

  const blockClassName =
    'flex flex-col gap-4 p-3 mobile:px-6 tablet:py-6 bgi-[var(--grayscale-20)]';

  return (
    <div
      className={cx('-mb-20 mobile:-mb-10 tablet:-mb-16', {
        'mt-4 mobile:mt-5': isRechargeFromGame,
      })}
    >
      <div className="text-[var(--grayscale-100)] flex flex-col gap-3 mobile:gap-4 tablet:gap-5 mb-[60px]">
        <div className={cx('flex flex-col gap-3 mobile:gap-4 tablet:gap-6')}>
          {/* 全部支付通道 */}
          <div className={cx(blockClassName, 'rounded-b-lg rounded-tr-lg')}>
            <img
              className="w-auto self-start h-4 mobile:h-6 tablet:h-8 object-contain"
              src={getImgUrl(EResourceLevel.V, 'pay')}
              alt="ipay"
            />
            <PayChannelList />
          </div>

          {/* 當前選定支付通道-充值選項 */}
          <div className={cx(blockClassName, 'rounded-lg')}>
            <PayChannelAmountOptions />
          </div>

          {/* 當前選定支付通道-最大最小充值金額 */}
          {/* 充值金額 輸入匡 */}
          <div className={cx(blockClassName, 'rounded-lg')}>
            <div className="text-base mobile:text-xl font-medium flex">
              <span>
                {t('wallet_deposit_deposit_amount', {
                  minLimit: rechargeLimitStr[0],
                  maxLimit: rechargeLimitStr[1],
                })}
              </span>
              <StarMark className="ml-[4px]" />
            </div>
            <WalletRechargeInput />
            <WalletRechargeCardSelect />
          </div>
        </div>
        {/* [一般，獎勵] 支付描述，連動 */}
        <RechargeCardDescription />
      </div>

      <AffixBottomWrapper>
        <div
          className={cx(
            'bgi-[var(--bg-main)] mobile:bgi-[#00000000]',
            'w-screen mobile:w-full',
            '-mx-4 mobile:-mx-0 p-4 mobile:p-0'
          )}
        >
          <BasePrimaryBtn
            className={cx('font-medium', { 'mb-[64px]': !isRechargeFromGame })}
            disabled={isEmpty(rechargeAmount)}
            debounceTimer={500}
            onClick={() => {
              handleWalletPageClick({
                actionName: handleWalletPageRechargeContentDepositBtnClick,
                payload: { isRechargeFromGame },
              });
            }}
            children={t('wallet_nav_deposit')}
          />
        </div>
      </AffixBottomWrapper>

      <RechargeNoticeModal />
    </div>
  );
};

export default RechargeContent;
