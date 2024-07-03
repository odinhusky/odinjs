import {ILoadingLogo} from "../../LoadingLogo";
import React from "react";
import cx from "../../../../utils/cx";
import {renderByUVersion} from "../../../../utils/renderByUVersion";


const LogoClassName = () => {
  return renderByUVersion({
    "u6": "lg:!w-[120px] lg:!h-[120px] !shadow-[0px_-8px_8px_0px_rgba(0,0,0,0.3)_inset]"
  },"")
}


export const LoadingLogo = (props: ILoadingLogo) => {
  return (
    <img alt="logo-loading" className={cx(
      "w-20 h-20 rounded-lg",
      "lg:w-24 lg:h-24 lg:rounded-xl",
      "shadow-[4px_4px_4px_0px_rgba(0,0,0,0.50)_inset,-4px_-4px_4px_0px_rgba(255,255,255,0.25)_inset]",
      props.className,
      LogoClassName()
    )}
         src={props.loadingIcon}
         />
  )
}
