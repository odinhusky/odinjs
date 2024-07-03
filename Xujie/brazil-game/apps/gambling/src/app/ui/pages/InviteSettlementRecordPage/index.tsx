import { renderByUVersion } from "../../utils/renderByUVersion";
import { InviteSettlementRecordPage as CInviteSettlementRecordPage } from "./env/u1/"
import { InviteSettlementRecordPage as RioInviteSettlementRecordPage } from "./env/u2"
import { InviteSettlementRecordPage as U5ioInviteSettlementRecordPage } from "./env/u5"
import { InviteSettlementRecordPage as U6InviteSettlementRecordPage } from "./env/u6"
import { InviteSettlementRecordPage as U7InviteSettlementRecordPage } from "./env/u7"

export const InviteSettlementRecordPage = () => {

  return renderByUVersion({
    "u2": <RioInviteSettlementRecordPage />,
    "u5": <U5ioInviteSettlementRecordPage />,
    "u6": <U6InviteSettlementRecordPage />,
    "u7": <U7InviteSettlementRecordPage />,
  }, <CInviteSettlementRecordPage />);
}
