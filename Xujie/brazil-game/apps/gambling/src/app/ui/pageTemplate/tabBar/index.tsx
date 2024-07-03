import {renderByUVersion} from "../../utils/renderByUVersion";
import {TabBar as PTabBar} from "./env/p1/index";
import {TabBar as CTabBar} from "./env/u1/index";
import {TabBar as RTabBar} from "./env/u2/index";
import {TabBar as U5TabBar} from "./env/u5/index";
import {TabBar as U6TabBar} from "./env/u6/index";
import {TabBar as U7TabBar} from "./env/u7/index";

import {ITabBar} from "./type";

export const TabBar = (props: ITabBar) => {
  return renderByUVersion({
    "wild777bet": <CTabBar {...props}/>,
    "p1": <PTabBar {...props}/>,
    "u1": <CTabBar {...props}/>,
    "u2": <RTabBar {...props}/>,
    "u5": <U5TabBar {...props}/>,
    "u6": <U6TabBar {...props}/>,
    "u7": <U7TabBar {...props}/>,
  }, <CTabBar {...props}/>);
}
