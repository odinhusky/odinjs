import {renderByUVersion} from "../../../../utils/renderByUVersion";

import {DepositNoticeSection as PDepositNoticeSection} from "../../env/pernambucana/tabsContent/deposit/DepositNoticeSection";
import {DepositNoticeSection as WDepositNoticeSection} from "../../env/wild/tabsContent/deposit/DepositNoticeSection";
import {DepositNoticeSection as CDepositNoticeSection} from "../../env/u1/tabsContent/deposit/DepositNoticeSection";

export const DepositNoticeSection = () => {

  return renderByUVersion({
    "wild777bet": (
      <WDepositNoticeSection />
    ),
    "u1": (
      <CDepositNoticeSection />
    )
  }, (
    <PDepositNoticeSection/>
  ))

}
