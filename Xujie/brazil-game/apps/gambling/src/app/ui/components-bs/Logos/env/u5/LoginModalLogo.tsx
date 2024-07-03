import React from "react";
import {environment} from "../../../../../../environments/environment";
import {twMerge} from "tailwind-merge";
import {ILogo} from "../types";

export const LoginModalLogo = (props: ILogo) => {
  return (
    <img alt=""  className={twMerge("w-[80px] h-[80px] rounded-xl",
      )} src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}/>
  )
}
