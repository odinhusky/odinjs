import React from "react";
import { renderByUVersion } from "../../utils/renderByUVersion";

// ? Components
import DailyCashBackModalP1 from "./env/p1/DailyCashBackModalP1";
import DailyCashBackModalU1 from "./env/u1/DailyCashBackModalU1";
import DailyCashBackModalU2 from "./env/u2/DailyCashBackModalU2";
import DailyCashBackModalU5 from "./env/u5/DailyCashBackModalU5";

export type DailyCashBackModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const DailyCashBackModal = (props: DailyCashBackModalProps) => {

  return renderByUVersion({
      "p1": (
        <DailyCashBackModalP1 {...props} />
      ),
      "u1": (
        <DailyCashBackModalU1 {...props} />
      ),
      "u2": (
        <DailyCashBackModalU2 {...props} />
      ),
      "u5": (
        <DailyCashBackModalU5 {...props} />
      )
    },
    <></>
  )
}

export default DailyCashBackModal;



