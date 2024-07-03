import { PageContainer } from "../../../../components-bs/PageContainer";
import { IWalletPage } from "../pernambucana/WalletPage";
import { BalanceSection } from "./BalanceSection";
import { BackNavigation } from "../../../../components-bs/BackNavigation/BackNavigation";
import { usePageNavigate } from "../../../../router/hooks/usePageNavigate";
import cx from "../../../../utils/cx";
import { DepositPanel } from "../../components/deposit/DepositPanel";
import { WithdrawPanel } from "../../components/withdraw/WithdrawPanel";
import { RecordPanel } from "./RecordPanel";
import WalletTabsGroup from "./components/WalletTabsGroup";
import WithdrawPanelTerms from "./components/WalletWithdrawPanelTerms";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { ProgressBar } from "../../../../components-bs/ProgressBar";

export const WalletPage = ({
                               totalSectionValues,
                               panelMode,
                               setPanelMode,
                               setRecordPanelMode,
                               rechargeData,
                               recordPanelMode,
                               damaResult,
                           }: IWalletPage) => {
    const { onClickToIndex } = usePageNavigate();
    const { isDesktop } = useBreakpoint();
    return (
        <PageContainer className={cx("text-white", "mb-0", "pt-3 ")}>
            {!isDesktop && (
                <BackNavigation
                    className={cx("text-base leading-6 tablet:text-xl tablet:leading-7")}
                    onClick={onClickToIndex}
                />
            )}

            <BalanceSection balanceSectionValue={totalSectionValues} />

            {damaResult.isShowDama && (
                <div className="flex flex-col gap-2 bg-[var(--grayscale-30)] rounded-xl tablet:py-6 tablet:px-12 p-4 tablet:mt-5 mobile:mt-4 mt-3">
                    <div className="font-medium tablet:text-base text-sm">
                        Progresso atual de apostas
                    </div>
                    <ProgressBar
                        className="h-5 text-[var(--grayscale-70)] bg-transparent font-normal gap-4 "
                        progressClassName="bg-[var(--grayscale-50)] h-full p-1"
                        progressColor="var(--linear-4-main)"
                        percentClassName="w-auto"
                        barClassName="shadow-none"
                        progress={damaResult.progressValue}
                    />
                </div>
            )}

            <div
                className="bg-[var(--grayscale-30)] rounded-xl
          mt-3 px-5 py-4
          mobile:mt-4 mobile:px-9 mobile:py-8
          tablet:mt-5 tablet:px-12 tablet:py-10
        "
            >
                <WalletTabsGroup panelMode={panelMode} setPanelMode={setPanelMode} />

                <div
                    className={cx(
                        "w-full",
                        "rounded-2xl",
                        "border-2 border-[var(--grayscale-70)]",
                        "py-3 px-4 mobile:py-4 mobile:px-6 tablet:py-6 tablet:px-[40px]",
                        "mt-4 mobile:mt-5 tablet:mt-6"
                    )}
                >
                    {panelMode === "deposit" ? (
                        <DepositPanel data={rechargeData?.data} />
                    ) : null}

                    {panelMode === "withdraw" ? (
                        <WithdrawPanel
                            onClickToWithdrawRecord={() => {
                                setPanelMode("record");
                                setRecordPanelMode("withdraw");
                            }}
                        />
                    ) : null}

                    {panelMode === "record" ? (
                        <RecordPanel recordPanelMode={recordPanelMode} />
                    ) : null}
                </div>

                {panelMode === "withdraw" ? <WithdrawPanelTerms /> : null}
            </div>
        </PageContainer>
    );
};
