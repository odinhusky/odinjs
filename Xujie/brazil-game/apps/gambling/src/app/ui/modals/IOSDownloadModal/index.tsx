import {renderByUVersion} from "../../utils/renderByUVersion";
import { CocoIOSDownloadModal } from "./env/u1"
import { RiojungleIOSDownloadModal } from "./env/u2"
import { IOSDownloadModal as U5IOSDownloadModal } from "./env/u5"
import { IOSDownloadModal as U6IOSDownloadModal } from "./env/u6"
import U7IOSDownloadModal from "./env/u7"

export type IOSDownloadModalProps = {
  onClose: () => void;
}

export const IOSDownloadModal = (props: IOSDownloadModalProps) => {
  return renderByUVersion({
    "u2": <RiojungleIOSDownloadModal />,
    "u5": <U5IOSDownloadModal />,
    "u6": <U6IOSDownloadModal />,
    "u7": <U7IOSDownloadModal {...props} />,
  }, <CocoIOSDownloadModal />);
}
