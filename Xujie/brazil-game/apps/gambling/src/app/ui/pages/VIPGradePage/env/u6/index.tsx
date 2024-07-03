import { IVIPGradePageProps } from "../../index";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { renderByRWD } from "../../../../utils/renderByRWD";
import { MobileVIPGradePage } from "./device/MobileVIPGradePage";
import { DesktopVIPGradePage } from "./device/DesktopVIPGradePage";
import { TabletVIPGradePage } from "./device/TabletVIPGradePage";
import { formatLocaleMoney } from "../../../../utils/format";

const jackpotMap: { [key: string]: string} = {
  '20': 'Audi A4',
  '21': 'BMW 520I',
  '22': 'Porsche Cayenne',
  '23': 'Porsche 911',
  '24': 'Ferrari 448',
  '25': 'Helicóptero',
}


const VIPGradePage = (props: IVIPGradePageProps) => {
  const device = useBreakpoint();

  const allLevelInfoWithBonus = props.allLevelInfo.map((info) => {
    const currentLevelSignInConfigData = props.allSignInConfig?.find((config)=> {
      return config.identifier.split('::')[2].replace('V', '') === `${info.level}`
    })
    const currentLevelSignInConfig = JSON.parse(currentLevelSignInConfigData?.value || '[]');
    const signInBonus = currentLevelSignInConfig?.reduce(
      (acc: number, current: { cashback: number }) => acc + current.cashback,
      0
    );

    return {
      ...info,
      signInBonus: `R$ ${formatLocaleMoney(signInBonus)}`,
      upRewardAmount: info.level < 20 ? `R$ ${formatLocaleMoney(info.upRewardAmout / 100)}`: `${jackpotMap[info.level.toString()]} Ou numerário de valor equivalente`,
      withdrawAmountLimitDayString: `R$ ${formatLocaleMoney(info.withdrawAmountLimitDay /100)}`
    }
  })

  return renderByRWD({
    desktop: <DesktopVIPGradePage allLevelInfoWithBonus={allLevelInfoWithBonus}  {...props}/>,
    tablet: <TabletVIPGradePage allLevelInfoWithBonus={allLevelInfoWithBonus}  {...props}/>,
    mobile: <MobileVIPGradePage allLevelInfoWithBonus={allLevelInfoWithBonus}  {...props}/>,
  }, device)
}


export default VIPGradePage
