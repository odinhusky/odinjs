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
import Icon from '@components/Icon';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import { useWalletPageRechargeContentStore } from '@mode2/zustand/page/WalletPage/walletPageRechargeContentStore';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageRechargeTabCheckOrderClick } from '@mode2/action/walletPageAction/acitonType';

export const RechargeContent = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  useRechargeContentBase({ isRechargeFromGame });

  const { t } = useTranslation();
  const { handleWalletPageClick } = useWalletPageActions();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();

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
      className={cx(
        'box-border',
        'bgi-[var(--grayscale-10)]',
        'tablet:bgi-[var(--grayscale-20)]',
        'bgi-text-[var(--grayscale-100)]',
        'h-full w-full',
        'rounded-none tablet:rounded',
        'p-0 tablet:p-6',
        'tablet:box-border',
        {
          'mt-4 mobile:mt-5': isRechargeFromGame,
        }
      )}
    >
      <div className="flex justify-between">
        <div className="flex">
          <span className="text-base font-medium tablet:text-xl">
            {t('wallet_deposit_deposit_channel')}
          </span>
          <StarMark className="ml-[4px]" />
        </div>
        {!isRechargeFromGame && (
          <div className="flex items-center">
            <Icon
              className="w-5 h-5 mobile:w-6 mobile:h-6"
              name="ic_check_order"
              color="var(--state-warn-main)"
            />
            <div
              className={cx(
                'text-xs mobile:text-base',
                'mobile:ml-1',
                'font-medium underline',
                'cursor-pointer',
                'bgi-text-[var(--state-warn-main)]',
                'decoration-[#FE8B34]'
              )}
              onClick={() => {
                handleWalletPageBaseClick({
                  actionName: handleWalletPageRechargeTabCheckOrderClick,
                });
              }}
            >
              {t('wallet_deposit_link_check_order')}
            </div>
          </div>
        )}
      </div>

      {/*mode2*/}
      <WalletRechargeCardSelect />

      {/* 當前選定支付通道-最大最小充值金額 */}
      <div
        className={cx(
          'text-base mobile:text-xl',
          'font-medium',
          'flex',
          'mt-6 mobile:mt-5 tablet:mt-6'
        )}
      >
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

      {/* space */}
      <div className={'mt-3 mobile:mt-4'}></div>

      {/* 當前選定支付通道-充值選項 */}
      {/*mode2*/}
      <PayChannelAmountOptions />

      <img
        className={cx(
          'w-auto self-start object-contain',
          'h-4 mobile:h-6 tablet:h-8',
          'mt-6 mobile:mt-5 tablet:mt-6'
        )}
        src={getImgUrl(EResourceLevel.V, 'pay')}
        alt="ipay"
      />

      {/* space */}
      <div className={'mt-3 mobile:mt-4'}></div>

      {/* 全部支付通道 */}
      <PayChannelList />

      {/* 提交按鈕 */}
      <div className={cx('mt-6 mobile:mt-5 tablet:mt-6')}>
        <AffixBottomWrapper>
          <BasePrimaryBtn
            className={cx('font-medium')}
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
        </AffixBottomWrapper>
      </div>

      {/* space */}
      <div className={'mt-6 mobile:mt-5 tablet:mt-6'}></div>

      {/* [一般，獎勵] 支付描述，連動 */}
      <RechargeCardDescription />

      <RechargeNoticeModal />
    </div>
  );
};

export default RechargeContent;
