import { IBoardData } from "../index";
import { ReactElement, ReactNode } from "react";
import { MobileMainBoard as CMobileMainBoard } from "../env/u1/MobileMainBoard";
import { MobileMainBoard as PMobileMainBoard } from "../env/p1/MobileMainBoard";
import { MobileMainBoard as WMobileMainBoard } from "../env/wild/MobileMainBoard";
import { MobileMainBoard as RMobileMainBoard } from "../env/u2/MobileMainBoard";

import { renderByUVersion } from "../../../../utils/renderByUVersion";

export interface IBoardContainer {
  children: ReactNode | ReactNode[];
}

export const MobileMainBoard = (props: IBoardData) => {
  return renderByUVersion({
    "wild777bet": <WMobileMainBoard {...props} />,
    "p1": <PMobileMainBoard {...props} />,
    "u1": <CMobileMainBoard {...props} />,
    "u2": <RMobileMainBoard {...props} />
  }, <PMobileMainBoard {...props} />)
}

