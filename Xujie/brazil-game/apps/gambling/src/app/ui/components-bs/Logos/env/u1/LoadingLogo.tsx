import React from "react";
import {environment} from "../../../../../../environments/environment";
import {tcx} from "../../../../utils/tcx";
import {ILoadingLogo} from "../../LoadingLogo";

// type ILogo = {
//   className?: string;
// }
export const LoadingLogo = (props: ILoadingLogo) => {
  return (
    <img alt="logo-loading" className={tcx(
      "w-[140px] h-[140px]",
      // "border-[4px] border-solid border-[var(--white)] rounded-[14.25px]",
      props.className
    )} src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}/>
    // <img className={twMerge("w-[50px] h-[50px]", props.className)} src={AssetMappingCoco["logo"]}/>
  )
}
