import { Dispatch, SetStateAction } from "react";
import WalletRecordTabsGroup from "./WalletRecordTabsGroup";
import WalletRecordDepositTable from "./WalletRecordDepositTable";
import WalletRecordWithdrawTable from "./WalletRecordWithdrawTable";
import cx from "apps/gambling/src/app/ui/utils/cx";

interface WalletSharedRecordPanelProps {
  recordPanelMode: "deposit" | "withdraw";
  setRecordPanelMode: Dispatch<SetStateAction<"deposit" | "withdraw">>;
}

const WalletSharedRecordPanel = ({
  recordPanelMode,
  setRecordPanelMode,
}: WalletSharedRecordPanelProps) => {
  return (
    <div className="flex flex-col mobile:gap-5 gap-3">
      <WalletRecordTabsGroup
        recordPanelMode={recordPanelMode}
        setRecordPanelMode={setRecordPanelMode}
      />

      <div
        className={cx(
          "bg-linear-4-main relative w-full rounded-lg shadow-[0px_4px_4px_0px_#00000040]"
        )}
      >
        <div className="border-popup-button absolute w-full h-full top-0 left-0 before:rounded-lg pointer-events-none mobile:block hidden" />
        {recordPanelMode === "deposit" && <WalletRecordDepositTable />}

        {recordPanelMode === "withdraw" && <WalletRecordWithdrawTable />}
      </div>
    </div>
  );
};

export default WalletSharedRecordPanel;
