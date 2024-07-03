import React from "react";
import {environment} from "../../../../../../environments/environment";
import {twMerge} from "tailwind-merge";
import {ILogo} from "../types";

export const LoginModalLogo = (props: ILogo) => {
  return (
    <img alt="logo-login-modal"  className={twMerge("w-[196px] h-[77px]",
      )} src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}/>
    // <img className={twMerge("w-[50px] h-[50px]", props.className)} src={AssetMappingCoco["logo"]}/>
  )
}
