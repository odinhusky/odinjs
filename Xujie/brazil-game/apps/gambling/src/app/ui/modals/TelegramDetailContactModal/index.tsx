import { TelegramDetailContactModal as CocoTelegramDetailContactModal } from "./env/u1";
import { TelegramDetailContactModal as RioTelegramDetailContactModal } from "./env/u2";
import { TelegramDetailContactModal as P1TelegramDetailContactModal } from "./env/p1";
import { TelegramDetailContactModal as U5TelegramDetailContactModal } from "./env/u5";
import { TelegramDetailContactModal as U6TelegramDetailContactModal } from "./env/u6";
import U7TelegramDetailContactModal from "./env/u7";

import { renderByUVersion } from "../../utils/renderByUVersion";

export interface ITelegramDetailContactModalProps {
  onClose: () => void;
  onClickToOpenTelegramService: () => void;
  onClickToOpenTelegramManager: () => void;
}

export const TelegramDetailContactModal = (props: ITelegramDetailContactModalProps) =>
  renderByUVersion({
    "u1": <CocoTelegramDetailContactModal {...props} />,
    "u2": <RioTelegramDetailContactModal {...props} />,
    "p1": <P1TelegramDetailContactModal {...props} />,
    "u5": <U5TelegramDetailContactModal {...props} />,
    "u6": <U6TelegramDetailContactModal {...props} />,
    "u7": <U7TelegramDetailContactModal {...props} />
  },<CocoTelegramDetailContactModal {...props} />)


