import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useLocation } from "react-router";
import { environment } from "../../../../../../environments/environment";
import { notification } from "antd";
import QRCode from "react-qr-code";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {formatLocaleMoney} from "../../../../utils/format";
import {appCopy} from "../../../../utils/appCopy";
import cx from "../../../../utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import WalletDepositLine from "./WalletDepositLine";
import BaseBtn from "../../../../components-bs/Buttons/BaseBtn";
import { FLEX_CENTER } from "apps/gambling/src/assets/constant/style";
import WalletBtn from "../../../WalletPage/env/u6/components/WalletBtn";

const COUNT_DOWN = 900;

export const WalletDepositNextPage = () => {
  useAllowLoginRouterRules();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [countdown, setCountdown] = useState(COUNT_DOWN); // 15分钟的秒数
  const [api, contextHolder] = notification.useNotification();

  const { onClickToWallet } = usePageNavigate()

  const location = useLocation();
  const data = location.state.data || {};
  const amount = location.state.amount || 0;

  const current = useMemo(()=> moment().format('DD.MM.YYYY HH:mm:ss'), [])

  const onClickToCopy = () => {
    appCopy(data?.data?.channelData?.paymentLink || '')
    api.success({
      message: t['Copied']
    })
  }

  const handleToWalletPage = () => {
    onClickToWallet({'panelType':'deposit'})
  }

  useEffect(() => {
    if (location.state.amount === 0) {
      handleToWalletPage()
    }
  }, [location.state.amount])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1);
      } else {
        handleToWalletPage()
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <PageContainer
      className={cx(
        'pt-3 pb-[96px] mobile:pb-0 tablet:pt-[36px] tablet:pb-[72px]'
      )}
    >
      {contextHolder}

      <BackNavigation
        className={cx(
          'text-base leading-6 tablet:text-xl tablet:leading-7',
          'mb-3 mobile:mb-4 tablet:mb-5'
        )}
        onClick={() => onClickToWallet({ 'panelType': 'deposit' })}
      />

      <div className={cx(
        'bg-[var(--grayscale-30)]',
        'rounded-2xl',
        'py-[16px] px-[20px] mobile:py-[24px] mobile:px-[36px] tablet:py-[32px] tablet:px-[48px]',
        'relative'
      )}>
        <div
          className={cx(
            'mb-3 mobile:mb-4 tablet:mb-6',
            'text-base text-center text-[var(--state-warn-main)]'
          )}
        >
          {t['payIn15Mins']}
        </div>

        <div>
          <div className='flex gap-3 mobile:gap-4 tablet:gap-5 flex-col md:flex-row'>
            <div className='w-full flex flex-col justify-between gap-3'>

              <WalletDepositLine
                title={t['createDate']}
                value={current}
              />

              <WalletDepositLine
                title={t['Time']}
                value={moment().startOf('day').seconds(countdown).format('mm:ss')}
              />

              <WalletDepositLine
                title={t['requestedNumber']}
                value={data?.data?.orderId || ''}
              />

              <div className={cx(
                'py-2 px-4 tablet:py-3 tablet:px-5',
                'bg-[var(--grayscale-40)]',
                'rounded-lg tablet:rounded-xl'
              )}>
                <div className={cx(
                  'text-sm leading-5 mobile:text-base mobile:leading-6 tablet:text-lg text-[var(--grayscale-70)]',
                  'mb-2 mobile:mb-1'
                )}>
                  {t['payOrder']}
                </div>

                <div className={cx(
                  'tablet:flex tablet:items-center'
                )}>
                  <div className={cx(
                    'w-full tablet:flex-1 tablet:w-auto',
                    'text-white break-all text-xs leading-4',
                    'mb-2 tablet:mb-0 tablet:mr-4'
                  )}>{data?.data?.channelData?.paymentLink || ''}</div>

                  <BaseBtn
                    btnClass={cx(
                      'w-full tablet:w-[169px]',
                      'h-[36px] mobile:h-[40px]',
                      'linear-3-button',
                      'border-0',
                      'py-2 px-[13px]'
                    )}
                    children={t['copyCode']}
                    childrenClass={cx(
                      'text-base leading-6 font-bold text-white'
                    )}
                    leftIcon={
                      <img
                        alt='Copy icon image'
                        className='w-6'
                        src={`assets/${environment.uVersion}/${environment.mVersion}/icon_deposit_next_copy.png`}
                      />
                    }
                    onClick={onClickToCopy}
                  />
                </div>
              </div>
            </div>
            
            {/* 右邊 QR Code 的部分 */}
            <div
              className={cx(
                'flex-1',
                'flex flex-col justify-center',
                'rounded-lg tablet:rounded-xl'
              )}
            >
              <div className={cx(
                'h-[44px] mobile:h-[40px] tablet:h-[52px]',
                'font-bold text-white text-base leading-6 tablet:text-xl tablet:leading-7',
                'bg-[var(--grayscale-40)]',
                'rounded-t-lg tablet:rounded-t-xl',
                FLEX_CENTER
              )}>
                {t['moneyWithRSign'](formatLocaleMoney(amount))}
              </div>

              <div className={cx(
                FLEX_CENTER,
                'flex-1',
                'p-4',
                'bg-[var(--grayscale-50)]',
                'rounded-b-lg tablet:rounded-b-xl',
              )}>
                <div className={cx(
                  'bg-white',
                  'rounded-lg tablet:rounded-xl',
                  'p-[9px]'
                )}>
                  <QRCode size={isTablet ? 149 : 176} value={String(data?.data?.channelData?.paymentLink || '')}/>
                </div>
              </div>
            </div>
          </div>
          
          <div className={cx(
            'w-full mobile:mt-5 tablet:mt-6 flex justify-center',
            'absolute left-0 -bottom-[49px] mobile:static'
          )}>
            <WalletBtn
              children={t['hadPaid']}
              onClick={handleToWalletPage}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
