import { IWithdrawPanelCommon } from "../../components/withdraw/WithdrawPanel";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import { renderByRWD } from "../../../../utils/renderByRWD";
import DesktopWithdrawPanel from "./device/DesktopWithdrawPanel";
import TabletWithdrawPanel from "./device/TabletWithdrawPanel";
import MobileWithdrawPanel from "./device/MobileWithdrawPanel";


export const WithdrawPanel = (props: IWithdrawPanelCommon) => {

  const device = useBreakpoint();

  return renderByRWD({
    desktop: <DesktopWithdrawPanel {...props} />,
    tablet: <TabletWithdrawPanel {...props} />,
    mobile: <MobileWithdrawPanel {...props} />,
  }, device)
}
