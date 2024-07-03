import React from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {renderByRWD} from "../../../../utils/renderByRWD";
import {MobileNotificationContainer} from "./device/MobileNotificationContainer";
import {TabletNotificationContainer} from "./device/TabletNotificationContainer";
import {DesktopNotificationContainer} from "./device/DesktopNotificationContainer";


export const NotificationContainer = ({
  children,
  closeDrawer
}: { children: React.ReactNode; closeDrawer: () => void }) => {
  const device = useBreakpoint()

  return renderByRWD({
    mobile: <MobileNotificationContainer children={children} />,
    tablet: <TabletNotificationContainer children={children} />,
    desktop: <DesktopNotificationContainer children={children} closeDrawer={closeDrawer} />,
  }, device)
}