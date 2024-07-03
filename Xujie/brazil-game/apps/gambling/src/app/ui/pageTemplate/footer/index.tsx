import {renderByUVersion} from "../../utils/renderByUVersion";
import {Footer as WFooter} from "./env/wild/Footer";
import {Footer as CFooter} from "./env/u1/Footer";
import {Footer as RFooter} from "./env/u2/Footer";
import {Footer as PFooter} from "./env/p1/Footer";
import {Footer as U5Footer} from "./env/u5/Footer";
import {Footer as U6Footer} from "./env/u6/Footer";
import {Footer as U7Footer} from "./env/u7/Footer";
import {IFooter} from "./types/IFooter";

export const Footer = (props: IFooter) => {
  return renderByUVersion({
    "wild777bet": <WFooter {...props}/>,
    "p1": <PFooter {...props}/>,
    "u1": <CFooter {...props}/>,
    "u2": <RFooter {...props}/>,
    "u5": <U5Footer {...props}/>,
    "u6": <U6Footer {...props}/>,
    "u7": <U7Footer {...props}/>,
  }, <WFooter {...props}/>);
}
