import {renderByUVersion} from "../../utils/renderByUVersion";
import {MenuDrawer as PMenuDrawer} from "./env/p1/MenuDrawer";
import {MenuDrawer as CMenuDrawer} from "./env/u1/MenuDrawer";
import {MenuDrawer as RMenuDrawer} from "./env/u2/MenuDrawer";
import {MenuDrawer as U5MenuDrawer} from "./env/u5/MenuDrawer";
import {MenuDrawer as U6MenuDrawer} from "./env/u6/MenuDrawer";
import {MenuDrawer as U7MenuDrawer} from "./env/u7/MenuDrawer";

export const MenuDrawer = (props: any) => {
  return renderByUVersion({
    // "wild777bet": <WFooter {...props}/>,
    "p1": <PMenuDrawer {...props}/>,
    "u1": <CMenuDrawer {...props}/>,
    "u2": <RMenuDrawer {...props}/>,
    "u5": <U5MenuDrawer {...props}/>,
    "u6": <U6MenuDrawer {...props}/>,
    "u7": <U7MenuDrawer {...props}/>
  }, <RMenuDrawer {...props}/>);
}
