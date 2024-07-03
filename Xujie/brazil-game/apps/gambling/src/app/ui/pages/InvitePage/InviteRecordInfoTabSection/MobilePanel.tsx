import styled from "styled-components";
import {environment} from "apps/gambling/src/environments/environment";
import {MobileMainBoard} from "./components/MobileMainBoard";
import {MobileTotalTable} from "./components/MobileTotalTable";
import {MobileDailyTable} from "./components/MobileDailyTable";
import {Level1RechargeData} from "../index";
import cx from "../../../utils/cx";


const GreenHRline = styled.div`
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg,transparent,#FFF600,#4FFB0C,transparent);
`

type IMobilePanel = {
  level1RechargeData: Level1RechargeData;
  isProxy: boolean;

  totalRewardData: any;

  totalInviteData: any;
  mobileTotalPanelMode: any;
  setMobileTotalPanelMode: (value: "1" | "2" | "3") => void;

  dailyData: any;
  mobileDailyPanelMode: any;
  setMobileDailyPanelMode: (value: "1" | "2" | "3") => void;
  orangeRecordDate: string
  onOrangeRecordDateSelect: (date: string) => void
}
export const MobilePanel = ({
  level1RechargeData,
  isProxy,
  totalRewardData,
  totalInviteData,
  mobileTotalPanelMode,
  setMobileTotalPanelMode,
  dailyData,
  mobileDailyPanelMode,
  setMobileDailyPanelMode,
  orangeRecordDate,
  onOrangeRecordDateSelect
}: IMobilePanel) => {

  const isCoco777bet=environment.uVersion === 'coco777bet';
  return (
    <div>
      <section className={"mb-4"}>
        <MobileMainBoard data={totalRewardData} />
        {!isCoco777bet && <GreenHRline className={"my-4"} />}
      </section>

      <section className={"mb-4"}>
        <div className={cx(" text-base text-left mb-1", {
          'text-[#4E91EF] font-bold': !isCoco777bet,
          'text-white': isCoco777bet
        })}><span className="font-bold mr-2">Dados totais</span><span className={"text-sm"}>(Atualize a cada 30 minutos)</span></div>
        <MobileTotalTable level1RechargeData={level1RechargeData} isProxy={isProxy} data={totalInviteData} type={mobileTotalPanelMode} onClick={(type) => setMobileTotalPanelMode(type as "1" | "2" | "3")} />
      </section>

      <section className={"mb-4"}>
        <div className={cx("  text-base text-left mb-1", {
          'text-[#EE9544] font-bold': !isCoco777bet,
          'text-white': isCoco777bet
        })}><span className="font-bold mr-2">Dados diários</span><span className={"text-sm"}>(Atualize a cada 30 minutos)</span></div>
        <MobileDailyTable isProxy={isProxy} records={dailyData} type={mobileDailyPanelMode} onClick={(type) => setMobileDailyPanelMode(type as "1" | "2" | "3")} recordDate={orangeRecordDate} onRecordDateSelect={onOrangeRecordDateSelect} />
      </section>
    </div>
  )
}
