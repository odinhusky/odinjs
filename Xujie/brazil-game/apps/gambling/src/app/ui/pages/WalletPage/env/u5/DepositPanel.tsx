import { renderByRWD } from "../../../../utils/renderByRWD";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import DesktopDepositPanel from "./device/DesktopDepositPanel";
import { IDepositPanelProps } from "../../components/deposit/DepositPanel";
import TabletDepositPanel from "./device/TabletDepositPanel";
import MobileDepositPanel from "./device/MobileDepositPanel";


export const DepositPanel = (props: IDepositPanelProps) => {
  const device = useBreakpoint()

  return renderByRWD({
    desktop: <DesktopDepositPanel {...props} />,
    tablet: <TabletDepositPanel {...props} />,
    mobile: <MobileDepositPanel {...props} />
  }, device)
}
