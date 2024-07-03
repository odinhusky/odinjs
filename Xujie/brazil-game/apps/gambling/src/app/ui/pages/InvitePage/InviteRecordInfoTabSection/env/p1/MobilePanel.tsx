import {MobileMainBoard} from "../../components/MobileMainBoard";
import {MobileTotalTable} from "../../components/MobileTotalTable";
import {MobileDailyTable} from "../../components/MobileDailyTable";
import {IMobilePanel} from '../..';
import {useNavigate} from 'react-router';


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
  onOrangeRecordDateSelect,
  setPanelMode
}: IMobilePanel) => {
  const navigate = useNavigate();

  return (
    <>
      <MobileMainBoard data={totalRewardData} />
      <MobileTotalTable level1RechargeData={level1RechargeData} isProxy={isProxy} data={totalInviteData} type={mobileTotalPanelMode} onClick={(type) => setMobileTotalPanelMode(type as "1" | "2" | "3")} />
      <MobileDailyTable isProxy={isProxy} records={dailyData} type={mobileDailyPanelMode} onClick={(type) => setMobileDailyPanelMode(type as "1" | "2" | "3")} recordDate={orangeRecordDate} onRecordDateSelect={onOrangeRecordDateSelect} />
    </>
  )
}
