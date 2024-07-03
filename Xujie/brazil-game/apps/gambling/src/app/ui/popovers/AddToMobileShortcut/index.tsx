import { renderByUVersion } from "../../utils/renderByUVersion";
import { CocoAddToMobileShortcut } from "./env/u1"
import { RionjungleAddToMobileShortcut } from "./env/u2"
import { AddToMobileShortcut as U5AddToMobileShortcut } from "./env/u5"
import { AddToMobileShortcut as U6AddToMobileShortcut } from "./env/u6"
import { AddToMobileShortcut as U7AddToMobileShortcut } from "./env/u7"
type IAddToMobileShortcut  = {
  isShowTabbar: boolean;
  className?: string,
  setOpenDownloadModal?: (value: any) => void;
}


export const AddToMobileShortcut = (props: IAddToMobileShortcut) => {
  return renderByUVersion({
    "u2": <RionjungleAddToMobileShortcut {...props} />,
    "u5": <U5AddToMobileShortcut {...props} />,
    "u6": <U6AddToMobileShortcut {...props} />,
    "u7": <U7AddToMobileShortcut {...props} />,
  }, <CocoAddToMobileShortcut {...props} />);
}
