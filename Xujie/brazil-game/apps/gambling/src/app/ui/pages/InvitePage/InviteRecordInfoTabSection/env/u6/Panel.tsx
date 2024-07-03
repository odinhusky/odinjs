import { Board } from "./Board";
import { useNavigate } from "react-router";
import { DailyTable } from "./DailyTable";
import { TotalTable } from "./TotalTable";
import { TabItem } from "./compontents/TabItem";
import { BackNavigation } from "../../../../../components-bs/BackNavigation/BackNavigation";
import { PageOrModalPathEnum } from "apps/gambling/src/app/ui/PageOrModalPathEnum";
import { useEffect } from "react";
import { environment } from "apps/gambling/src/environments/environment";
import useBreakpoint from "apps/gambling/src/app/ui/pageTemplate/hooks/useBreakpoint";
import cx from "apps/gambling/src/app/ui/utils/cx";
import {Level1RechargeData} from "../../../index";

export const Panel = ({
  level1RechargeData,
  isProxy,
  totalRewardData,
  totalInviteData,
  totalPanelMode,
  setTotalPanelMode,
  dailyData,
  dailyPanelMode,
  setDailyPanelMode,
  onBack,
  setPanelMode,
}: {
  level1RechargeData: Level1RechargeData;
  isProxy: boolean;
  totalRewardData: any;
  totalInviteData: any;
  totalPanelMode: any;
  setTotalPanelMode: (value: "1" | "2" | "3") => void;
  dailyData: any;
  dailyPanelMode: any;
  setDailyPanelMode: (value: "1" | "2" | "3") => void;
  onBack: () => void;
  setPanelMode:any;
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();
  useEffect(() => {
    const pageContainer = document.getElementById("page-container");
    if (pageContainer) {
      pageContainer.scrollTop = 0;
    }
  }, []);

  return (
    <div className="flex flex-col tablet:gap-6 mobile:gap-4 gap-3 text-[var(--grayscale-100)]">
      <BackNavigation
        className="tablet:text-xl text-base font-medium"
        onClick={onBack}
      />
      {/* banner */}
      <section className="relative">
        <img
          className="w-full"
          src={`assets/${environment.uVersion}/${
            environment.mvVersion
          }/internal_banner_recommend${
            isMobile ? "_m" : isTablet ? "_t" : ""
          }.png`}
          alt="banner"
        />
        <div
          className="absolute w-[70%] aspect-[0/1] mobile:text-[56px] mobile:leading-[64px] text-xl tablet:font-black font-bold 
            top-1/2 -translate-y-1/2 left-[5%] drop-shadow-[0px_4px_4px_#00000040]"
        >
          Exclusivo plano de promoção
        </div>
      </section>
      <section className="flex mobile:gap-3 gap-2 tablet:text-lg mobile:text-base text-sm tablet:justify-center justify-between font-medium">
        <button
          className="tablet:w-auto w-full border-[1.5px] border-solid border-[var(--grayscale-90)] mobile:py-2 mobile:px-24 py-1 px-4 rounded-lg"
          onClick={()=>{setPanelMode("howto")}}
        >
          Como convidar
        </button>
        <div
          className="bg-linear-4-main text-center tablet:w-auto w-full mobile:py-2 mobile:px-24 py-1 px-4 rounded-lg 
            shadow-[0px_-4px_4px_0px_#00000033_inset,0px_4px_4px_0px_#FFFFFF33_inset]"
        >
          Dados diários
        </div>
      </section>
      {/* 内容 */}
      <section
        className="flex flex-col tablet:gap-6 mobile:gap-5 gap-4 bg-[var(--grayscale-30)] rounded-xl font-medium
          tablet:py-10 tablet:px-12 mobile:py-8 mobile:px-9 py-4 px-5"
      >
        <Board data={totalRewardData} />
        <div className="flex tablet:text-base text-sm bg-[var(--grayscale-50)] rounded-lg tablet:py-2 tablet:px-10 py-2 px-4 justify-between items-center">
          As recompensas de troca de Jogos são liquidadas toda segunda-feira
          <button
            className="linear-1-button tablet:w-[120px] tablet:h-12 w-[100px] h-9 min-w-[65px] tablet:font-medium font-bold rounded-lg"
            onClick={() =>
              navigate(PageOrModalPathEnum.InviteSettlementRecordPage)
            }
          >
            Registro
          </button>
        </div>

        <div
          className=" flex flex-col tablet:gap-6 mobile:gap-4 border-solid tablet:border-2 border-[1px] border-[var(--grayscale-70)] rounded-xl 
            tablet:py-6 tablet:px-10 mobile:py-4 mobile:px-6 py-3 px-4"
        >
          <div className="tablet:text-xl mobile:text-lg text-base font-medium mobile:text-left text-center">
            Dados totais
          </div>
          <div className="flex mobile:flex-row flex-col-reverse mobile:mt-0 mt-1 justify-between items-center">
            <div
              id={"tab-item"}
              className="flex mobile:w-auto w-full justify-start items-start"
            >
              <div className="flex w-full bg-[var(--grayscale-40)] rounded-lg">
                {(["1", "2", "3"] as const).map((key) => (
                  <TabItem
                    className={'rounded-[8px] border-[0px]'}
                    key={key}
                    active={totalPanelMode === key}
                    onClick={() => setTotalPanelMode(key)}
                    name={`Nível ${key}`}
                  />
                ))}
              </div>
            </div>
            <div
              className={cx(
                "flex flex-col mobile:text-sm text-xs mobile:w-auto w-full mobile:mb-0 mb-3 justify-between  items-center",
                {
                  "flex-col items-center": !isProxy,
                }
              )}
            >
              {totalPanelMode=== "1" && level1RechargeData.isShowDividends && (
                <div className="text-right">{level1RechargeData.dividendsText}</div>
              )}
              { totalPanelMode === "1" && level1RechargeData.isAvgAmountShow &&
                  <div className="text-right">{level1RechargeData.avgAmountText}</div>
              }
              <div className="text-[var(--grayscale-70)] text-right">
                Atualize a cada 30 minutos
              </div>
            </div>
          </div>
          <div className="mobile:mt-0 mt-3">
            <TotalTable
              isProxy={isProxy}
              type={totalPanelMode}
              data={totalInviteData}
            />
          </div>
        </div>
        {/* 列表 */}
        <div
          className=" flex flex-col tablet:gap-6 mobile:gap-4 border-solid tablet:border-2 border-[1px] border-[var(--grayscale-70)] rounded-xl 
            tablet:py-6 tablet:px-10 mobile:py-4 mobile:px-6 py-3 px-4"
        >
          <div className="tablet:text-xl mobile:text-lg text-base font-medium mobile:text-left text-center">
            Dados diários
          </div>
          <div className="flex mobile:flex-row flex-col-reverse mobile:mt-0 mt-1 justify-between items-center">
            <div
              id={"tab-item"}
              className="flex mobile:w-auto w-full justify-start items-start"
            >
              <div className="flex w-full bg-[var(--grayscale-40)] rounded-lg">
                {(["1", "2", "3"] as const).map((key) => (
                  <TabItem
                    className={'rounded-[8px] border-[0px]'}
                    key={key}
                    active={dailyPanelMode === key}
                    onClick={() => setDailyPanelMode(key)}
                    name={`Nível ${key}`}
                  />
                ))}
              </div>
            </div>
            <div className="mobile:text-sm text-xs text-[var(--grayscale-70)] mobile:mb-0 mb-3">
              Atualize a cada 30 minutos
            </div>
          </div>
          <DailyTable
            isProxy={isProxy}
            type={dailyPanelMode}
            records={dailyData}
          />
        </div>
      </section>
    </div>
  );
};
