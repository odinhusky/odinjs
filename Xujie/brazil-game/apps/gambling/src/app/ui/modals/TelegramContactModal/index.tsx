import {renderByUVersion} from "../../utils/renderByUVersion";
import {CocoTelegramContactModal} from "./env/u1"
import {RiojungleTelegramContactModal} from './env/u2'
import {TelegramContactModal as P1TelegramContactModal} from './env/p1'
import {TelegramContactModal as U5jungleTelegramContactModal} from './env/u5'
import {TelegramContactModal as U6jungleTelegramContactModal} from './env/u6'
import {TelegramContactModal as U7jungleTelegramContactModal} from './env/u7'

export type ITelegramContactModal = {
  close: () => void;
  toTelegramGroup: () => void;
}

export const TelegramContactModal = (props: ITelegramContactModal) => {

  return renderByUVersion({
    "p1": <P1TelegramContactModal {...props}/>,
    "u2": <RiojungleTelegramContactModal {...props}/>,
    "u5": <U5jungleTelegramContactModal {...props}/>,
    "u6": <U6jungleTelegramContactModal {...props}/>,
    "u7": <U7jungleTelegramContactModal {...props}/>,
  }, <CocoTelegramContactModal {...props}/>);
}

