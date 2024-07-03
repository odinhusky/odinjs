import { IWalletPage } from "../../pernambucana/WalletPage";
import {useState} from "react";
import {usePageNavigate} from "../../../../../router/hooks/usePageNavigate";
import {useScrollSelectFixCenter} from "../../../../../hooks/useScrollSelectFixCenter";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {BalanceCard} from "../components/BalanceCard";
import {environment} from "../../../../../../../environments/environment";
import {PanelModeTab} from "../components/PanelModeTab";
import {DepositPanel} from "../../../components/deposit/DepositPanel";
import {WithdrawPanel} from "../../../components/withdraw/WithdrawPanel";
import {RecordPanel} from "../RecordPanel";
import { ProgressBar } from "apps/gambling/src/app/ui/components-bs/ProgressBar";


const MobileWalletPage = ({
  totalSectionValues,
  panelMode,
  setPanelMode,
  setRecordPanelMode,
  rechargeData,
  recordPanelMode,
  damaResult
}: IWalletPage) => {
  const [balanceCardType, setBalanceCardType] = useState<'total' | 'deposit' | 'promotion'>('total')

  const { onClickToIndex } = usePageNavigate()

  const { scrollWrapperRef} = useScrollSelectFixCenter(1, false, 'instant')


  return (
    <div className='text-white pb-[100px]'>
      <div
        className='px-4'
      >
        <BackNavigation
          onClick={onClickToIndex}
        />
      </div>

      <div
        className='relative'
      >
        <div className='relative flex overflow-hidden gap-3' ref={scrollWrapperRef}>
          <BalanceCard
            className='flex-shrink-0 w-11/12 brightness-50'
            title={balanceCardType === 'total' ? 'Conta promovida' : balanceCardType === 'deposit' ? 'Total Da Conta' : 'Depositar conta'}
            balance={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['promotion']?.balance : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['total']?.balance : 0 : totalSectionValues ? totalSectionValues['deposit']?.balance : 0}
            extractable={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['promotion']?.retrievable : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['total']?.retrievable : 0 : totalSectionValues ? totalSectionValues['deposit']?.retrievable : 0}
          />

          <BalanceCard
            className='flex-shrink-0 w-11/12'
            title={balanceCardType === 'total' ? 'Total Da Conta' : balanceCardType === 'deposit' ? 'Depositar conta' : 'Conta promovida'}
            balance={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['total']?.balance : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['deposit']?.balance : 0 : totalSectionValues ? totalSectionValues['promotion']?.balance : 0}
            extractable={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['total']?.retrievable : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['deposit']?.retrievable : 0 : totalSectionValues ? totalSectionValues['promotion']?.retrievable : 0}
          />

          <BalanceCard
            className='flex-shrink-0 w-11/12 brightness-50'
            title={balanceCardType === 'total' ? 'Depositar conta' : balanceCardType === 'deposit' ? 'Conta promovida' : 'Total Da Conta'}
            balance={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['deposit']?.balance : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['promotion']?.balance : 0 : totalSectionValues ? totalSectionValues['total']?.balance : 0}
            extractable={balanceCardType === 'total' ? totalSectionValues ? totalSectionValues['deposit']?.retrievable : 0 : balanceCardType === 'deposit' ? totalSectionValues ? totalSectionValues['promotion']?.retrievable : 0 : totalSectionValues ? totalSectionValues['total']?.retrievable : 0}
          />
        </div>

        <img
          alt='left'
          className='w-8 absolute top-1/2 -translate-y-1/2 left-5 cursor-pointer'
          src={`assets/${environment.uVersion}/icon_arrow_left_wallet.png`}
          onClick={() => {
            if (balanceCardType === 'total') {
              setBalanceCardType('promotion')
            } else if (balanceCardType === 'deposit') {
              setBalanceCardType('total')
            } else {
              setBalanceCardType('deposit')
            }
          }}
        />

        <img
          alt='right'
          className='w-8 absolute top-1/2 -translate-y-1/2 right-5 cursor-pointer'
          src={`assets/${environment.uVersion}/icon_arrow_right_wallet.png`}
          onClick={() => {
            if (balanceCardType === 'total') {
              setBalanceCardType('deposit')
            } else if (balanceCardType === 'deposit') {
              setBalanceCardType('promotion')
            } else {
              setBalanceCardType('total')
            }
          }}
        />

      </div>

      {damaResult.isShowDama && (
        <div className="flex flex-col gap-2 mt-3 mx-4">
          <div className="text-xs text-[var(--grayscale-100)] font-bold">
            Progresso atual de apostas
          </div>
          <ProgressBar
            className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
            progress={damaResult.progressValue}
            progressClassName="bg-[var(--grayscale-50)]"
          />
        </div>
      )} 

      <PageContainer
        className='pt-0 pb-0'
      >
        <div
          className='flex justify-center mt-8'
        >
          <PanelModeTab
            className='w-11/12'
            tabItemClassName='w-full'
            panelMode={panelMode}
            setPanelMode={setPanelMode}
          />
        </div>

        {
          panelMode === 'deposit' && <DepositPanel data={rechargeData?.data} />
        }

        {
          panelMode === 'withdraw' &&
          <WithdrawPanel
            onClickToWithdrawRecord={() => {
              setPanelMode("record");
              setRecordPanelMode("withdraw");}}
          />
        }

        {
          panelMode === 'record' &&
          <RecordPanel
            recordPanelMode={recordPanelMode}
          />
        }

      </PageContainer>

    </div>
  )
}

export default MobileWalletPage
