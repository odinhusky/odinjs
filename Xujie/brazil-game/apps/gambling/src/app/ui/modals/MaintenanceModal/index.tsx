import { CocoMaintenanceModal } from "./env/u1/"
import { RiojungleMaintenanceModal } from "./env/u2/modal"
import { U5MaintenanceModal } from "./env/u5/modal"
import { U6MaintenanceModal } from "./env/u6/modal"
import { U7MaintenanceModal } from "./env/u7/modal"

import {renderByUVersion} from "../../utils/renderByUVersion";

interface IMaintenanceModal {
  onClickToOpenTelegramService: () => void
}

export const MaintenanceModal = (props: IMaintenanceModal) => {
  return renderByUVersion({
    "u2": <RiojungleMaintenanceModal {...props}/>,
    "u5": <U5MaintenanceModal {...props}/>,
    "u6": <U6MaintenanceModal {...props}/>,
    "u7": <U7MaintenanceModal {...props}/>,
  }, <CocoMaintenanceModal {...props}/>);
}
