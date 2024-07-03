import React, { Dispatch, SetStateAction, useState } from "react";
import { tcx } from "../../utils/tcx";
import { renderByUVersion } from "../../utils/renderByUVersion";
import { Drawer as CDrawer } from "./env/u1/Drawer";
import { Drawer } from "./env/default/Drawer";


export interface IConfirmDrawerProps {
  title: string
  content: string
  buttonText: string
  onClose: () => void
  className?: string
  buttonStyle?: string
}

export interface IAnimateDrawerProps {
  open: boolean;
  setOpen: any;
}

const ConfirmDrawer = (props: IConfirmDrawerProps) => {
  const [open, setOpen] = useState(true)

  return renderByUVersion({
    "wild777bet": (
      <Drawer {...props} open={open} setOpen={setOpen} />
    ),
    "p1": (
      <Drawer {...props} open={open} setOpen={setOpen} />
    ),
    "u1": (
      <CDrawer {...props} open={open} setOpen={setOpen} />
    ),
  }, <Drawer {...props} open={open} setOpen={setOpen} />)
}

export default ConfirmDrawer;
