import cx from "apps/gambling/src/app/ui/utils/cx";
import WalletRecordTab from "./WalletRecordTab";
import { Dispatch, SetStateAction } from "react";
import t from "apps/gambling/src/assets/constant/lang";

interface WalletRecordTabsGroupProps {
  recordPanelMode: 'deposit' | 'withdraw'
  setRecordPanelMode: Dispatch<SetStateAction<'deposit' | 'withdraw'>>
}

export const WalletRecordTabsGroup = ({
  recordPanelMode,
  setRecordPanelMode
}: WalletRecordTabsGroupProps) => {
  return (
    <div className={cx('flex justify-center')}>
      <div className={cx(
        'flex'
      )}>
        <WalletRecordTab
          active={recordPanelMode === 'deposit'} title={t['Deposit']}
          onClick={() => setRecordPanelMode("deposit")} 
        />
        <WalletRecordTab
          active={recordPanelMode === 'withdraw'} title={t['Withdraw']}
          onClick={() => setRecordPanelMode("withdraw")}
        />
      </div>
    </div>
  )
}

export default WalletRecordTabsGroup;