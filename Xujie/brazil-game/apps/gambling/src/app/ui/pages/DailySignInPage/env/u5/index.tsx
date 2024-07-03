import {GetPunchInConfigResponse} from "../../../../../external/PunchInEndpoint";
import {IDailySignInPageProps} from "../../index";
import {renderByRWD} from "../../../../utils/renderByRWD";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {DesktopDailySignInPage} from "./device/DesktopDailySignInPage";
import {TabletDailySignInPage} from "./device/TabletDailySignInPage";
import {MobileDailySignInPage} from "./device/MobileDailySignInPage";




const DailySignInPage = (props: IDailySignInPageProps) => {
  const device = useBreakpoint()

  return renderByRWD({
    desktop: <DesktopDailySignInPage {...props} />,
    tablet: <TabletDailySignInPage {...props} />,
    mobile: <MobileDailySignInPage {...props} />,
  }, device)
}

export default DailySignInPage;