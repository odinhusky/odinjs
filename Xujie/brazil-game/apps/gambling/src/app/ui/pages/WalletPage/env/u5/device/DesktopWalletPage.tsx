import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { PageContainer } from "../../../../../components-bs/PageContainer";
import { usePageNavigate } from "../../../../../router/hooks/usePageNavigate";
import { IWalletPage } from "../../pernambucana/WalletPage";
import { DepositPanel } from "../../../components/deposit/DepositPanel";
import { WithdrawPanel } from "../../../components/withdraw/WithdrawPanel";
import { RecordPanel } from "../RecordPanel";
import { BalanceCard } from "../components/BalanceCard";
import { PanelModeTab } from "../components/PanelModeTab";
import { ProgressBar } from "apps/gambling/src/app/ui/components-bs/ProgressBar";

const DesktopWalletPage = ({
  totalSectionValues,
  panelMode,
  setPanelMode,
  setRecordPanelMode,
  rechargeData,
  recordPanelMode,
  damaResult,
}: IWalletPage) => {
  const { onClickToIndex } = usePageNavigate();

  return (
    <PageContainer>
      <BackNavigation onClick={onClickToIndex} />

      <div className="flex justify-between gap-5 mt-5">
        <BalanceCard
          title="Total Da Conta"
          balance={
            totalSectionValues ? totalSectionValues["total"]?.balance : 0
          }
          extractable={
            totalSectionValues ? totalSectionValues["total"]?.retrievable : 0
          }
        />
        <BalanceCard
          title="Depositar conta"
          balance={
            totalSectionValues ? totalSectionValues["deposit"]?.balance : 0
          }
          extractable={
            totalSectionValues ? totalSectionValues["deposit"]?.retrievable : 0
          }
        />
        <BalanceCard
          title="Conta promovida"
          balance={
            totalSectionValues ? totalSectionValues["promotion"]?.balance : 0
          }
          extractable={
            totalSectionValues
              ? totalSectionValues["promotion"]?.retrievable
              : 0
          }
        />
      </div>

      {damaResult.isShowDama && (
        <div className="flex flex-col gap-2 mt-5">
          <div className="text-sm text-[var(--grayscale-100)] font-bold">
            Progresso atual de apostas
          </div>
          <ProgressBar
            className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
            progress={damaResult.progressValue}
            progressClassName="bg-[var(--grayscale-50)]"
          />
        </div>
      )}

      <div className="flex justify-center mt-16">
        <PanelModeTab panelMode={panelMode} setPanelMode={setPanelMode} />
      </div>

      {panelMode === "deposit" && <DepositPanel data={rechargeData?.data} />}

      {panelMode === "withdraw" && (
        <WithdrawPanel
          onClickToWithdrawRecord={() => {
            setPanelMode("record");
            setRecordPanelMode("withdraw");
          }}
        />
      )}

      {panelMode === "record" && (
        <RecordPanel recordPanelMode={recordPanelMode} />
      )}
    </PageContainer>
  );
};

export default DesktopWalletPage;
