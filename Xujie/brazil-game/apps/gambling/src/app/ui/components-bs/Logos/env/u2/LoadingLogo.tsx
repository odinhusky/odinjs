import React from "react";
import {environment} from "../../../../../../environments/environment";
import {twMerge} from "tailwind-merge";
import {ILoadingLogo} from "../../LoadingLogo";

export const LoadingLogo = (props: ILoadingLogo) => {
  return (
    <img alt="logo-loading" className={twMerge(
      "w-[320px] h-[128px]",
      props.className
    )} src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}/>
    // <img className={twMerge("w-[50px] h-[50px]", props.className)} src={AssetMappingCoco["logo"]}/>
  )
}
