import React from 'react';
import cx from '@commonUtils/cx';
import { EResourceLevel, formatMoney, getImgUrl } from '@mode2/utils';
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
import { InternalPayContent } from '@/components/InternalPayContent';
import CustomizeCheckoutPage from '@pages/CustomizeCheckoutPage';
import RechargeNoticeModal from '@modals/RechargeNoticeModal';
import { PayChannelAmountOptions } from '@components/PayChannelAmountOptions';
import { isEmpty } from 'lodash';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import AffixBottomWrapper from '@mode2/components/AffixBottomWrapper';
import RechargeTopBonusSwitch from '@components/RechargeTopBonusSwitch';
import useHighBonusRechargeContentBase from '@mode2/usecase/page/walletPage/rechargeContent/useHighBonusRechargeContentBase';
import {
  RechargeCard,
  useWalletPageRechargeCardStore,
  useWalletRechargeHighBonusStore,
} from '@mode2/zustand/page/WalletPage/useWalletPageRechargeCardStore';
import Icon from '@mode2/components/Icon';
import useWalletPageBaseActions from '@mode2/action/walletPageAction/useWalletPageBaseActions';
import { handleWalletPageRechargeTabCheckOrderClick } from '@mode2/action/walletPageAction/acitonType';
import { useBreakPoint } from '@libs/commonUtils';

export const RechargeContent = ({
  isRechargeFromGame = false,
}: {
  isRechargeFromGame?: boolean;
}) => {
  useRechargeContentBase({ isRechargeFromGame });

  useHighBonusRechargeContentBase();
  const { isMobile } = useBreakPoint();
  const { t } = useTranslation();

  const { handleWalletPageClick } = useWalletPageActions();
  const { handleWalletPageBaseClick } = useWalletPageBaseActions();
  // /* 連動當前通道 最大最小充值金額 */

  const rechargeStatus = useRechargeStore((state) => state.rechargeStatus);
  const rechargeAmount = useRechargeStore((state) => state.rechargeAmount);

  const isSupportHighBonus = useWalletRechargeHighBonusStore(
    (state) => state.isSupportHighBonus
  );
  const currentRechargeCard = useWalletPageRechargeCardStore(
    (state) => state.currentRechargeCard
  );
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
            <div className="flex justify-between items-center">
              <img
                className="w-auto self-start h-4 mobile:h-6 tablet:h-8 object-contain"
                src={getImgUrl(EResourceLevel.V, 'pay')}
                alt="ipay"
              />

              {!isRechargeFromGame ? (
                <div className="flex items-center">
                  <Icon
                    className="w-5 h-5"
                    name="ic_check_order"
                    color="var(--state-warn-main)"
                  />
                  <div
                    className={cx(
                      'text-xs mobile:text-sm tablet:ml-1 font-medium underline cursor-pointer bgi-text-[var(--state-warn-main)] decoration-[#FE8B34]'
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
              ) : null}
            </div>

            <PayChannelList />
          </div>

          {/* 當前選定支付通道-充值選項 */}
          <div className={cx(blockClassName, 'rounded-lg')}>
            {isSupportHighBonus ? (
              <div
                className="rounded-t-lg p-3 mobile:px-6 -mx-3 -mt-3 mobile:-mx-6 mobile:-mt-3 tablet:-mt-6 bg-si"
                style={{
                  backgroundImage:
                    currentRechargeCard === RechargeCard.HIGH_BONUS
                      ? `url(${getImgUrl(
                          EResourceLevel.V,
                          'deposit_wheel_prize_bg'
                        )})`
                      : 'var(--linear-4)',

                  backgroundSize: '100%',
                  backgroundPosition: isMobile ? '0 -2rem' : '0 -10vw',
                }}
              >
                <RechargeTopBonusSwitch />
              </div>
            ) : null}

            <div className=" flex flex-col justify-center items-center">
              <p className="text-sm font-medium bgi-text-[var(--grayscale-70)]">
                {t('wallet_deposit_amount_to_receive')}
              </p>
              <p className="text-2xl font-medium bgi-text-[var(--grayscale-100)]">
                {formatMoney(Number(rechargeAmount))}
              </p>
            </div>

            <div className="">
              <PayChannelAmountOptions />
            </div>
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
              console.log('@@@===> BasePrimaryBtn');
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
