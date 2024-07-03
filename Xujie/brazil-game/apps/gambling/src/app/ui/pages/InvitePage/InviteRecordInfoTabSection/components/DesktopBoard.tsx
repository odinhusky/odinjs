import { IBoardData } from "../index";
import { ReactElement, ReactNode } from "react";
import { DesktopBoard as CDesktopBoard } from "../env/u1/DesktopBoard";
import { DesktopBoard as PDesktopBoard } from "../env/p1/DesktopBoard";
import { DesktopBoard as WDesktopBoard } from "../env/wild/DesktopBoard";
import { DesktopBoard as RDesktopBoard } from "../env/u2/DesktopBoard";
import { renderByUVersion } from "../../../../utils/renderByUVersion";

export interface IBoardContainer {
  children: ReactNode | ReactNode[];
  className?: string;
}

export const DesktopBoard = (props: IBoardData) => {
  return renderByUVersion(
    {
      wild777bet: <WDesktopBoard {...props} />,
      p1: <PDesktopBoard {...props} />,
      u1: <CDesktopBoard {...props} />,
      u2: <RDesktopBoard {...props} />,
    },
    <PDesktopBoard {...props} />
  );
};
