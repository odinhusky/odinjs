import { Dispatch, SetStateAction } from "react";
import WalletRecordTabsGroup from "./WalletRecordTabsGroup";
import WalletRecordDepositTable from "./WalletRecordDepositTable";
import WalletRecordWithdrawTable from "./WalletRecordWithdrawTable";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletSharedRecordPanelProps {
  recordPanelMode: 'deposit' | 'withdraw'
  setRecordPanelMode: Dispatch<SetStateAction<'deposit' | 'withdraw'>>
}

const WalletSharedRecordPanel = ({
  recordPanelMode,
  setRecordPanelMode
}: WalletSharedRecordPanelProps) => {

  return (
    <div>
      <WalletRecordTabsGroup
        recordPanelMode={recordPanelMode}
        setRecordPanelMode={setRecordPanelMode}
      />

      <div className={cx(
        'w-full',
        'mt-3 mobile:mt-4 tablet:mt-6'
      )}>
        {
          recordPanelMode === 'deposit' && (
            <WalletRecordDepositTable />
          )
        }

        {
          recordPanelMode === 'withdraw' && (
            <WalletRecordWithdrawTable />
          )
        }
      </div>
    </div>
  )
}

export default WalletSharedRecordPanel
