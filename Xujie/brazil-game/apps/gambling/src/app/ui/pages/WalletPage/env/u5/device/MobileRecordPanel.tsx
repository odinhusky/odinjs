import { Dispatch, SetStateAction } from "react";
import {twMerge} from "tailwind-merge";
import {MobileDepositTable} from "./MobileDepositTable";
import {MobileWithdrawTable} from "./MobileWithdrawTable";


const TabItem = ({ title, onClick, active }:{title: string; onClick: () => void; active: boolean}) => {
  return (
    <button
      className={twMerge(
        'text-white font-bold text-sm py-[10px] w-full',
        active && 'bg-linear-5-main rounded-full shadow-[0px_4px_4px_0px_rgba(0,0,0,.25)]'
      )}
      onClick={onClick}
    >
      {title}
    </button>
  )
}

interface IMobileRecordPanelProps {
  recordPanelMode: 'deposit' | 'withdraw'
  setRecordPanelMode: Dispatch<SetStateAction<'deposit' | 'withdraw'>>
}


const MobileRecordPanel = ({
  recordPanelMode,
  setRecordPanelMode
}: IMobileRecordPanelProps) => {

  return (
    <div
      className='mt-4 bg-[var(--grayscale-20)] rounded-lg py-4 px-3'
    >
      <div className='flex justify-center'>
        <div
          className='flex w-full bg-linear-5-disabled rounded-full'>
          <TabItem active={recordPanelMode === 'deposit'} title='Depósito'
                   onClick={() => setRecordPanelMode("deposit")}/>
          <TabItem active={recordPanelMode === 'withdraw'} title='Retirar'
                   onClick={() => setRecordPanelMode("withdraw")}/>

        </div>
      </div>

      {
        recordPanelMode === 'deposit' && (
          <div
            className='mt-4'
          >
            <MobileDepositTable />
          </div>
        )
      }

      {
        recordPanelMode === 'withdraw' && (
          <div
            className='mt-4'
          >
            <MobileWithdrawTable />
          </div>
        )
      }

    </div>
  )
}

export default MobileRecordPanel
