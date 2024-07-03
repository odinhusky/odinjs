import {renderByUVersion} from "../../utils/renderByUVersion";
import { CocoDownloadModal } from "./env/u1"
import { RiojungleDownloadModal } from "./env/u2"
import { DownloadModal as U5DownloadModal } from "./env/u5"
import { DownloadModal as U6DownloadModal } from "./env/u6"
import { DownloadModal as U7DownloadModal } from "./env/u7"


export type IInitialChargeModal = {
  close: () => void;
}

export const DownloadModal = (props: IInitialChargeModal) => {
  return renderByUVersion({
    "u2": <RiojungleDownloadModal {...props}/>,
    "u5": <U5DownloadModal {...props}/>,
    "u6": <U6DownloadModal {...props}/>,
    "u7": <U7DownloadModal {...props}/>,
  }, <CocoDownloadModal {...props}/>);
}
