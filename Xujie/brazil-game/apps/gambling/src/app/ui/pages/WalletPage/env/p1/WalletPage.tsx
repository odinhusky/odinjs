import { TabItem, Tabs } from "../../../../components-bs/TabItem/TabItem";
import React from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { DepositPanel } from "../../components/deposit/DepositPanel";
import { WithdrawPanel } from "../../components/withdraw/WithdrawPanel";
import { RecordPanel } from "../../components/record/RecordPanel";

import { useAllowLoginRouterRules } from "../../../../router/hooks/useAllowLoginRouterRules";
import { TotalSectionContainer } from "../../components/TotalSectionContainer";
import { CommonTableTabG } from "../../../../components-bs/TabItem/CommonTableTabG";
import cx from "classnames";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { IWalletPage } from "../pernambucana/WalletPage";
import { PageContainer } from "../../../../components-bs/PageContainer";
import { ProgressBar } from "../../../../components-bs/ProgressBar";

export const WalletPage = (props: IWalletPage) => {
  useAllowLoginRouterRules();

  const { isMobile } = useBreakpoint();

  return (
    <PageContainer className="py-8">
      <div className="p-2 bg-green-800/70 rounded-[19px]">
        <TotalSectionContainer />

        <div id={"tab-item"}>
          <Tabs
            className={
              "game-type-tab-list flex font-medium mt-3 mb-[18px] md:my-8 justify-between md:justify-center items-center"
            }
          >
            <TabItem
              className={cx(
                "px-4 lg:px-[40px] flex-1 lg:!text-lg lg:flex-none mr-2 lg:mr-4"
              )}
              active={props.panelMode === "deposit"}
              onClick={() => {
                props.setPanelMode("deposit");
              }}
              name="Depósito"
              pureColor
            />
            <TabItem
              className={cx(
                "px-4 lg:px-[40px] flex-1 lg:!text-lg lg:flex-none mr-2 lg:mr-4"
              )}
              active={props.panelMode === "withdraw"}
              onClick={() => {
                props.setPanelMode("withdraw");
              }}
              name="Retirar"
              pureColor
            />
            <TabItem
              className={cx(
                "px-4 lg:px-[40px] flex-1 lg:!text-lg lg:flex-none"
              )}
              active={props.panelMode === "record"}
              onClick={() => {
                props.setPanelMode("record");
              }}
              name="Registro"
              pureColor
            />
          </Tabs>
        </div>

        {props.damaResult.isShowDama && (
          <div className="flex flex-col gap-[5.5px] tablet:rounded-2xl rounded-xl border-solid border-[1px] border-[var(--outline-primary)] bg-[var(--background-textfields)] tablet:px-8 tablet:py-5 p-4">
            <div className="flex text-[var(--white)] text-lg justify-between font-normal">
              <div className="drop-shadow-[0px_1px_2px_#0000000F]">
                Progresso atual de apostas
              </div>
              <div className="drop-shadow-[0px_1px_2px_#0000000F] w-20 text-right">{props.damaResult.progressText}</div>
            </div>
            <div>
              <ProgressBar
                className="h-6 bg-white"
                rounded="rounded-full"
                progress={props.damaResult.progressValue}
                progressColor="linear-gradient(180deg, #FBFF3F 0%, #FEC600 100%)"
              />
            </div>
          </div>
        )}

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
      </div>
    </PageContainer>
  );
};
