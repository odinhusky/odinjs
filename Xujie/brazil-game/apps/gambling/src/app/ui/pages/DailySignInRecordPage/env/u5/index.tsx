import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../utils/renderByRWD";
import {MobileDailySignInRecordPage} from "./device/MobileDailySignInRecordPage";
import {TabletDailySignInRecordPage} from "./device/TabletDailySignInRecordPage";
import {DesktopDailySignInRecordPage} from "./device/DesktopDailySignInRecordPage";
import {useAllowLoginRouterRules} from "../../../../router/hooks/useAllowLoginRouterRules";


export const DailySignInRecordPage = () => {
  useAllowLoginRouterRules();

  const device = useBreakpoint()

  return renderByRWD({
    mobile: <MobileDailySignInRecordPage />,
    tablet: <TabletDailySignInRecordPage />,
    desktop: <DesktopDailySignInRecordPage />,
  }, device)
}