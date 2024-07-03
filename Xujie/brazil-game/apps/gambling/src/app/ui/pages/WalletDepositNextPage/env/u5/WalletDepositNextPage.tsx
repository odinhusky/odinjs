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
import cx from "classnames";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {formatLocaleMoney} from "../../../../utils/format";
import {appCopy} from "../../../../utils/appCopy";

const COUNT_DOWN = 900


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
      message: "Copiado!"
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
    <PageContainer>
      {contextHolder}
      <BackNavigation
        onClick={() => onClickToWallet({ 'panelType': 'deposit' })}
      />

      <div
        className='mt-8 py-3 px-5 rounded-lg text-base bg-[var(--grayscale-15)] border border-[var(--grayscale-40)] text-[var(--state-warn-main)]'>
        Ordem de pagamento criada com sucesso, pague em 15 minutos!
      </div>

      <div
        className={cx(
            'mt-5 rounded-lg bg-[var(--grayscale-20)]',
            {'p-8': isDesktop || isTablet},
            {'p-4': isMobile},
        )}
      >
        <div className='flex gap-8 flex-col md:flex-row'>
          <div className='w-full flex flex-col justify-between gap-3'>
            <div className='py-3 px-5 flex justify-between bg-[var(--grayscale-30)] rounded-lg'>
              <div className='text-base text-[var(--grayscale-70)]'>Data de criaqao
              </div>
              <div className='text-base text-white font-bold'>{current}</div>
            </div>
            <div className='py-3 px-5 flex justify-between bg-[var(--grayscale-30)] rounded-lg'>
              <div className='text-base text-[var(--grayscale-70)]'>Tempo</div>
              <div
                className='text-base text-white font-bold'>{moment().startOf('day').seconds(countdown).format('mm:ss')}</div>
            </div>
            <div className='py-3 px-5 flex justify-between bg-[var(--grayscale-30)] rounded-lg'>
              <div className='text-base text-[var(--grayscale-70)]'>Numero solicitado</div>
              <div
                className='text-base text-white font-bold'>{data?.data?.orderId || ''}</div>
            </div>

            <div className={cx(
                'py-3 px-5 flex flex-wrap justify-between bg-[var(--grayscale-30)] rounded-lg',
                {'items-center': isDesktop}
            )}>
              <div className='text-base text-[var(--grayscale-70)]'>Pague a corda</div>
              <div className={cx(
                  'text-white break-all text-xs',
                      {'flex-1 ml-5 mr-2.5 ' : isDesktop || isTablet },
                      {'w-full mt-2.5' : isMobile}
              )}>{data?.data?.channelData?.paymentLink || ''}</div>
              <button
                  className={cx(
                      'linear-5-button',
                      'text-base  font-bold flex gap-2 cursor-pointer justify-center',
                      'flex justify-center gap-2 text-sm rounded-full text-[var(--grayscale-100)]',
                      'py-2.5',
                      {'px-5': isDesktop},
                      {'w-full mt-2.5': isTablet || isMobile},
                  )}
                  onClick={onClickToCopy}
              >
                <img alt='copy' className='h-6 w-6'
                     src={`assets/${environment.uVersion}/${environment.mVersion}/icon_deposit_next_copy.png`}/>
                <div>Copiar Código</div>
              </button>
            </div>
          </div>
          <div className='flex flex-col gap-3 justify-center rounded-lg py-0 px-0 md:py-[26px] md:px-3 bg-none md:bg-[var(--grayscale-30)]'>
            <div className="text-center text-base font-bold text-white">
              R$ {formatLocaleMoney(amount)}
            </div>
            <div className={'flex justify-center'}>
              <QRCode value={String(data?.data?.channelData?.paymentLink || '')}/>
            </div>
          </div>
        </div>

        <div className='mt-8 flex justify-center'>
          <button
            className={cx(
                'linear-5-button',
                'font-extrabold min-w-[200px] md:min-w-[480px] rounded-full py-3 text-white',
                'bg-linear-5-main',
            )}
            onClick={handleToWalletPage}
          >
            Ja pago
          </button>
        </div>

      </div>
    </PageContainer>
  )
}
