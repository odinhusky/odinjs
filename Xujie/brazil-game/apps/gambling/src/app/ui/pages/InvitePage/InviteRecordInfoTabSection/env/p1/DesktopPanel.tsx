import {DesktopBoard} from "../../components/DesktopBoard";
import {useNavigate} from "react-router";
import {environment} from "apps/gambling/src/environments/environment";
import cx from 'classnames';
import {DesktopDailyTable} from "./DesktopDailyTable";
import {MobileDailyTable} from "./MobileDailyTable"
import {IDesktopPanel} from "../..";
import {PageContainer} from "../../../../../components-bs/PageContainer";
import {DesktopTotalTable} from "./DesktopTotalTable";
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation";
import {IPanelMode} from "../../..";
import {PageOrModalPathEnum} from "apps/gambling/src/app/ui/PageOrModalPathEnum";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";
import {TabItem} from "../../../../../components-bs/TabItem/TabItem";

export const DesktopPanel = ({
                                 level1RechargeData,
                                 isProxy,
                                 totalRewardData,

                                 totalInviteData,
                                 // mobileTotalPanelMode,
                                 // setMobileTotalPanelMode,
                                 totalPanelMode,
                                 setTotalPanelMode,

                                 dailyData,
                                 mobileDailyPanelMode,
                                 setMobileDailyPanelMode,
                                 orangeRecordDate,
                                 onOrangeRecordDateSelect,
                                 dailyPanelMode,
                                 setDailyPanelMode,
                                 setPanelMode
                             }: IDesktopPanel) => {
    const {isTablet} = useBreakpoint();
    const navigate = useNavigate();
    return (
        <>
            <div className='flex justify-end items-center mb-5'>
                <button
                    onClick={() => navigate(PageOrModalPathEnum.InviteSettlementRecordPage)}
                    className="bg-gradient-to-b from-[var(--btn-gradient1-from)] to-[var(--btn-gradient1-to)] text-sm lg:text-lg leading-5 lg:leading-7 text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)] relative flex flex-row justify-center py-2.5 lg:py-1.5 px-5 cursor-pointer rounded-[100px]"
                >
                    Registro
                </button>
            </div>

            <DesktopBoard data={totalRewardData}/>

            <section>
                <div className="text-[var(--white)] text-xl font-bold mt-4 mb-2">Dados Totais</div>
                <div
                    className={"flex flex-col lg:flex-row justify-between items-center flex-wrap mb-2 md:mb-3 lg:mb-4"}>
                    <div id={"tab-item"} className="flex justify-start items-start ">
                        <div className="bg-[var(--grayscale-20)] flex flex-row rounded-[100px]">
                            <TabItem active={totalPanelMode === "1"} onClick={() => setTotalPanelMode("1")}
                                     name={'Nível 1'}/>
                            <TabItem active={totalPanelMode === "2"} onClick={() => setTotalPanelMode("2")}
                                     name={'Nível 2'}/>
                            <TabItem active={totalPanelMode === "3"} onClick={() => setTotalPanelMode("3")}
                                     name={'Nível 3'}/>
                        </div>
                    </div>
                    <div className={"text-sm lg:text-base text-center lg:text-right mt-2 lg:mt-0 font-medium"}>
                        {totalPanelMode === "1" && level1RechargeData.isShowDividends &&
                            <div
                                className="text-[var(--state-success)]">{level1RechargeData.dividendsText}</div>
                        }
                        {totalPanelMode === "1" && level1RechargeData.isAvgAmountShow &&
                            <div
                                className="text-[var(--state-success)]">{level1RechargeData.avgAmountText}</div>
                        }
                        <div className="text-[var(--state-warning)] font-normal">Atualize a cada 30 minutos</div>
                    </div>
                </div>

                <div className={"mb-4"}>
                    <DesktopTotalTable isProxy={isProxy} type={totalPanelMode} data={totalInviteData}/>
                </div>

            </section>

            <section>
                <div className="text-[var(--white)] text-xl font-bold mt-4 mb-2">Dados Diários</div>
                <div
                    className={"flex flex-col lg:flex-row justify-between items-center flex-wrap mb-2 md:mb-3 lg:mb-4"}>
                    <div id={"tab-item"} className="flex justify-start items-start">
                        <div className="bg-[var(--grayscale-20)] flex flex-row rounded-[100px]">
                            <TabItem active={dailyPanelMode === "1"} onClick={() => setDailyPanelMode("1")}
                                     name={'Nível 1'}/>
                            <TabItem active={dailyPanelMode === "2"} onClick={() => setDailyPanelMode("2")}
                                     name={'Nível 2'}/>
                            <TabItem active={dailyPanelMode === "3"} onClick={() => setDailyPanelMode("3")}
                                     name={'Nível 3'}/>
                        </div>
                    </div>
                    <div className={"text-sm lg:text-base text-center lg:text-right mt-2 lg:mt-0 font-bold"}>
                        {/*{isProxy && <div*/}
                        {/*  className="text-[var(--white)]">Dividends:R$ {dailyData !== undefined ? dailyData[0]?.dividendos : "0.00"}</div>}*/}
                        <div className="text-[var(--state-warning)] font-normal">Atualize a cada 30 minutos</div>
                    </div>
                </div>

                <div className={"mb-4"}>
                    {
                        <DesktopDailyTable isProxy={isProxy} type={dailyPanelMode} records={dailyData}/>
                    }

                </div>

            </section>
        </>
    )
}
