import React from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { DepositPanel } from "../../components/deposit/DepositPanel";
import { WithdrawPanel } from "../../components/withdraw/WithdrawPanel";
import { RecordPanel } from "../../components/record/RecordPanel";

import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { TotalSectionContainer } from "./TotalSectionContainer";
import { IWalletPage } from "../pernambucana/WalletPage";
import TabDeposit from "./assets/icon-tab-deposit.png";
import TabWithdraw from "./assets/icon-tab-withdraw.png";
import TabRecord from "./assets/icon-tab-record.png";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { TabItem } from "../../../../components-bs/TabItem/env/u2/TabItem";
import { Tabs } from "../../../../components/Tabs";
import { ProgressBar } from "../../../../components-bs/ProgressBar";

export const WalletPage = (props: IWalletPage) => {
  useAllowLoginRouterRules();
  const { isMobile } = useBreakpoint();
  return (
    <PageContainer>
      <TotalSectionContainer totalSectionValues={props.totalSectionValues} />

      {props.damaResult.isShowDama && (
        <div className="flex flex-col gap-2 text-[var(--white)] mt-5">
          <div className="text-xs text-[var(--secondary-main)] font-medium">
            Progresso atual de apostas
          </div>
          <div className="w-full">
            <ProgressBar
              className="h-10 py-[10px] px-5 mt-2 text-white text-sm font-medium bg-[var(--grayscale-30)] border border-[var(--grayscale-30)]"
              progress={props.damaResult.progressValue}
              progressClassName="bg-[var(--grayscale-50)]"
            />
          </div>
        </div>
      )}

      <div
        id={"tab-item"}
        className="w-full flex justify-center items-center my-3 md:my-5"
      >
        <Tabs>
          <TabItem
            active={props.panelMode === "deposit"}
            onClick={() => {
              props.setPanelMode("deposit");
            }}
            icon={TabDeposit}
            name={"Depósito"}
          />
          <TabItem
            active={props.panelMode === "withdraw"}
            onClick={() => {
              props.setPanelMode("withdraw");
            }}
            icon={TabWithdraw}
            name={"Retirar"}
          />
          <TabItem
            active={props.panelMode === "record"}
            onClick={() => {
              props.setPanelMode("record");
            }}
            icon={TabRecord}
            name={"Registro"}
          />
        </Tabs>
      </div>
      <div className={""}>
        {props.panelMode === "deposit" ? (
          <DepositPanel data={props.rechargeData?.data} />
        ) : props.panelMode === "withdraw" ? (
          <WithdrawPanel
            onClickToWithdrawRecord={() => {
              props.setPanelMode("record");
              props.setRecordPanelMode("withdraw");
            }}
          />
        ) : (
          <RecordPanel recordPanelMode={props.recordPanelMode} />
        )}
      </div>
    </PageContainer>
  );
};
