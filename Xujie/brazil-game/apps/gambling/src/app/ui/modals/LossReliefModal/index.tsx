import React from "react";
import { renderByUVersion } from "../../utils/renderByUVersion";

// ? Components
import LossReliefModalP1 from "./env/p1/LossReliefModalP1";
import LossReliefModalU1 from "./env/u1/LossReliefModalU1";
import LossReliefModalU2 from "./env/u2/LossReliefModalU2";
import LossReliefModalU5 from "./env/u5/LossReliefModalU5";

export type LossReliefModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const LossReliefModal = (props: LossReliefModalProps) => {

  return renderByUVersion({
      "p1": (
        <LossReliefModalP1 {...props} />
      ),
      "u1": (
        <LossReliefModalU1 {...props} />
      ),
      "u2": (
        <LossReliefModalU2 {...props} />
      ),
      "u5": (
        <LossReliefModalU5 {...props} />
      )
    },
    <></>
  )
}

export default LossReliefModal;



