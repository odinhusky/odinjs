import React from "react";
import { renderByUVersion } from "../../utils/renderByUVersion";

// ? Components
import BoxModalP1 from "./env/p1/BoxModalP1";
import BoxModalU1 from "./env/u1/BoxModalU1";
import BoxModalU2 from "./env/u2/BoxModalU2";
import BoxModalU5 from "./env/u5/BoxModalU5";

export type BoxModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  isOpen?: boolean;
}

export const BoxModal = (props: BoxModalProps) => {

  return renderByUVersion({
      "p1": (
        <BoxModalP1 {...props} />
      ),
      "u1": (
        <BoxModalU1 {...props} />
      ),
      "u2": (
        <BoxModalU2 {...props} />
      ),
      "u5": (
        <BoxModalU5 {...props} />
      )
    },
    <></>
  )
}

export default BoxModal;



