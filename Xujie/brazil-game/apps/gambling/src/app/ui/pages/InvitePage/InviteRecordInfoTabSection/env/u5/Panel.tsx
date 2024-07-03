import {Board} from "./Board"
import {useNavigate} from "react-router"
import {DailyTable} from "./DailyTable"
import {TotalTable} from "./TotalTable"
import {TabItem} from "./compontents/TabItem"
import {BackNavigation} from "../../../../../components-bs/BackNavigation/BackNavigation"
import {PageOrModalPathEnum} from "apps/gambling/src/app/ui/PageOrModalPathEnum"
import {useEffect} from "react"
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
}: {
  level1RechargeData: Level1RechargeData;
  isProxy: boolean
  totalRewardData: any
  totalInviteData: any
  totalPanelMode: any
  setTotalPanelMode: (value: "1" | "2" | "3") => void
  dailyData: any
  dailyPanelMode: any
  setDailyPanelMode: (value: "1" | "2" | "3") => void
  onBack: () => void
}) => {
  const navigate = useNavigate()
  useEffect(()=>{
   const pageContainer =  document.getElementById('page-container')
   if(pageContainer) {
    pageContainer.scrollTop = 0
   }
  },[])
  return (
    <>
      <BackNavigation className="sm:pt-5 pb-8 max-mobile:pb-4" onClick={onBack} />
      <section className="bg-[var(--grayscale-20)] p-8 max-sm:p-4 rounded-lg">
        <Board data={totalRewardData} />
        <div className="w-full p-3 bg-[var(--grayscale-10)] rounded-lg flex max-sm:flex-col max-sm:text-center justify-between items-center mt-8">
          <span className="text-white text-base leading-6">
            As recompensas de troca de Jogos são liquidadas toda segunda-feira
          </span>
          <button
            onClick={() =>
              navigate(PageOrModalPathEnum.InviteSettlementRecordPage)
            }
            className="max-sm:w-[200px] w-[120px] h-9 max-sm:mt-3 font-bold text-sm leading-5 lg:leading-7 text-white shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]
            linear-6-button"
          >
            Registro
          </button>
        </div>
      </section>

      <section className="bg-[var(--grayscale-20)] p-8 max-sm:p-4 rounded-lg mt-3">
        <div className="text-lg tablet:text-2xl font-bold text-white max-sm:text-center">
          Dados totais
        </div>
        <div className="mt-3 sm:mt-4 tablet:mt-5 flex max-sm:flex-col justify-between items-center">
          <div
            id={"tab-item"}
            className="flex justify-start items-start max-sm:mb-3 "
          >
            <div className="bg-linear-6-disabled flex flex-row rounded-lg">
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
            className={"text-sm lg:text-base text-end lg:text-right font-bold"}
          >
            {totalPanelMode === "1" && level1RechargeData.isShowDividends && (
              <div className="text-[var(--grayscale-100)] max-sm:text-center">
                {level1RechargeData.dividendsText}
              </div>
            )}

            {totalPanelMode === "1" && level1RechargeData.isAvgAmountShow &&
                <div className="text-[var(--grayscale-100)] max-sm:text-center">
                  {level1RechargeData.avgAmountText}
                </div>
            }
            <div className="text-[var(--grayscale-70)]">
              Atualize a cada 30 minutos
            </div>
          </div>
        </div>

        <TotalTable
          isProxy={isProxy}
          type={totalPanelMode}
          data={totalInviteData}
        />
      </section>

      <section
        className={"bg-[var(--grayscale-20)] p-8 max-sm:p-4 rounded-lg mt-3"}
      >
        <div className="text-lg tablet:text-2xl font-bold text-white max-sm:text-center">
          Dados diários
        </div>
        <div className="mt-3 sm:mt-4 tablet:mt-5 flex max-sm:flex-col justify-between items-center">
          <div
            id={"tab-item"}
            className="flex justify-start items-start max-sm:mb-3"
          >
            <div className="bg-linear-6-disabled flex flex-row rounded-lg">
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
          <div
            className={"text-sm lg:text-base text-end lg:text-right font-bold"}
          >
            <div className="text-[var(--grayscale-70)]">
              Atualize a cada 30 minutos
            </div>
          </div>
        </div>

        <DailyTable
          isProxy={isProxy}
          type={dailyPanelMode}
          records={dailyData}
        />
      </section>
    </>
  )
}
