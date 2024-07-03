import { Dispatch, SetStateAction } from "react";
import { DesktopDepositTable } from "./DesktopDepositTable";
import { DesktopWithdrawTable } from "./DesktopWithdrawTable";
import { twMerge } from "tailwind-merge";


const TabItem = ({ title, onClick, active }:{title: string; onClick: () => void; active: boolean}) => {
  return (
    <button
      className={twMerge(
        'text-white font-bold text-sm py-[10px] w-[160px]',
        active && 'bg-linear-5-main rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,.25)]'
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

interface IDesktopRecordPanelProps {
  recordPanelMode: 'deposit' | 'withdraw'
  setRecordPanelMode: Dispatch<SetStateAction<'deposit' | 'withdraw'>>
}

const DesktopRecordPanel = ({
  recordPanelMode,
  setRecordPanelMode
}: IDesktopRecordPanelProps) => {

  return (
    <div className='bg-[var(--grayscale-20)] rounded-lg p-8 text-white mt-8'>

      <div className='flex justify-center'>
        <div className='flex w-fit bg-linear-5-disabled rounded-full'>
          <TabItem active={recordPanelMode === 'deposit'} title='Depósito' onClick={() => setRecordPanelMode("deposit")} />
          <TabItem active={recordPanelMode === 'withdraw'} title='Retirar' onClick={() => setRecordPanelMode("withdraw")} />

        </div>
      </div>

      {
        recordPanelMode === 'deposit' && (
          <DesktopDepositTable />
        )
      }

      {
        recordPanelMode === 'withdraw' && (
          <DesktopWithdrawTable />
        )
      }
    </div>
  )
}

export default DesktopRecordPanel
