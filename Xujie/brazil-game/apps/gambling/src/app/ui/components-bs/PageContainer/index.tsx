import {renderByUVersion} from "../../utils/renderByUVersion";
import {PageContainer as PPageContainer} from "./env/p1/PageContainer";
import {PageContainer as CocoPageContainer} from "./env/u1/PageContainer";
import {PageContainer as RiojungleContainer} from "./env/u2/PageContainer";
import {PageContainer as U5PageContainer} from "./env/u5/PageContainer";
import {PageContainer as U6PageContainer} from "./env/u6/PageContainer";
import {PageContainer as U7PageContainer} from "./env/u7/PageContainer";
import {CSSProperties} from "react";

export type IContainer = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  y?: boolean;
  style?: CSSProperties;
  id?: string;
}

export const PageContainer = (props: IContainer) => {
  return renderByUVersion({
    "p1": (
      <PPageContainer {...props}/>
    ),
    "u1": (
      <CocoPageContainer {...props}/>
    ),
    "u2": (
      <RiojungleContainer {...props}/>
    ),
    "u5": (
      <U5PageContainer {...props}/>
    ),
    "u6": (
      <U6PageContainer {...props}/>
    ),
    "u7": (
      <U7PageContainer {...props}/>
    ),
  }, <CocoPageContainer {...props}/>)
}
