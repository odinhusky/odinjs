import React from 'react';
import cx from '@commonUtils/cx';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import useWalletPageActions from '@/action/walletPageAction/useWalletPageActions';
import { handleWalletPageRechargeContentDepositBtnClick } from '@mode2/action/actionTypes';
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
import isEmpty from 'lodash/isEmpty';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import { RechargeContentProps } from '../RechargeContentProps';

export const RechargeContent = ({
  isRechargeFromGame = false,
}: RechargeContentProps) => {
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

  return (
    <div
      className={cx('-mb-20 mobile:-mb-10 tablet:-mb-16', {
        'mt-4 mobile:mt-5': isRechargeFromGame,
      })}
    >
      <div className="text-[var(--grayscale-100)] flex flex-col gap-3 mobile:gap-4 tablet:gap-5 mb-[60px]">
        <div className={cx('flex flex-col gap-5 mobile:gap-4 tablet:gap-6')}>
          <div className={cx(FLEX_ITEMS_CENTER)}>
            <img
              className={cx(
                'w-auto self-start h-[18px] mobile:h-8 object-contain',
                'mr-auto'
              )}
              src={getImgUrl(EResourceLevel.V, 'pay')}
              alt="Pay"
            />
          </div>

          {/* 全部支付通道 */}
          <PayChannelList />

          {/* 當前選定支付通道-充值選項 */}
          {/*mode1*/}
          <PayChannelAmountOptions />

          <div className="flex flex-col gap-2 mobile:gap-3 tablet:gap-4">
            {/* 當前選定支付通道-最大最小充值金額 */}
            <div className="text-base mobile:text-xl font-medium flex">
              <span>
                {t('wallet_deposit_deposit_amount', {
                  minLimit: rechargeLimitStr[0],
                  maxLimit: rechargeLimitStr[1],
                })}
              </span>
              <StarMark className="ml-[4px]" />
            </div>
            {/* 充值金額 輸入匡 */}
            <WalletRechargeInput />
          </div>

          <WalletRechargeCardSelect />
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
            onClick={() => {
              handleWalletPageClick({
                actionName: handleWalletPageRechargeContentDepositBtnClick,
                payload: { isRechargeFromGame },
              });
            }}
            children={t('wallet_nav_deposit')}
          />
          {/* <button
          className={cx(
            'h-10 text-base mobile:text-lg bgi-text-[var(--grayscale-100)] font-medium rounded-[4px] w-full mb-[64px]',
            'flex items-center justify-center',
            'bgi-[var(--base-1-main)] hover:bgi-[var(--base-1-light)] active:bgi-[var(--base-1-dark)]',
            'disabled:bgi-[var(--transparent-gray-30)] disabled:bgi-text-[var(--transparent-white-30)]'
          )}
          disabled={isEmpty(rechargeAmount)}
          onClick={() => {
            handleWalletPageClick({
              actionName: handleWalletPageRechargeContentDepositBtnClick,
              payload: { isRechargeFromGame },
            });
          }}
        >
          {t('wallet_nav_deposit')}
        </button> */}
        </div>
      </AffixBottomWrapper>

      <RechargeNoticeModal />
    </div>
  );
};

export default RechargeContent;
