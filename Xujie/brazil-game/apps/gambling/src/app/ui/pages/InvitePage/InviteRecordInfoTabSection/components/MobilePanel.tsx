import { IMobilePanel } from "../index";
import { MobilePanel as CMobilePanel } from "../env/u1/MobilePanel";
import { MobilePanel as PMobilePanel } from "../env/p1/MobilePanel";
import { MobilePanel as WMobilePanel } from "../env/wild/MobilePanel";
import { MobilePanel as RMobilePanel } from "../env/u2/MobilePanel";
import { renderByUVersion } from "../../../../utils/renderByUVersion";

export const MobilePanel = (props: IMobilePanel) => {
  return renderByUVersion({
    "wild777bet": <WMobilePanel {...props} />,
    "p1": <PMobilePanel {...props} />,
    "u1": <CMobilePanel {...props} />,
    "u2": <RMobilePanel {...props} />
  }, <PMobilePanel {...props} />)
}

