import React from "react";
import {environment} from "../../../../environments/environment";

export const MenuIcon = () => {
  return (
    <img
      alt={"menu"}
      // className={"w-[22.5px] h-[22.5px]"}
      className={"w-[23px] h-[18px]"}
      src={`assets/${environment.uVersion}/icon=menu.png`}
    />
  )
}
