import {environment} from "../../../../../../environments/environment";
import React from "react";
import {ILogo} from "../types";
import cx from "classnames";
import {CacheImage} from "../../../../components/image/CacheImage";

export const MenuLogo = (props: ILogo) => {
  return (
    <CacheImage
      alt={'logo-menu'}
      src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
      className={cx("w-[48px] h-[48px]", props.className)}
    />
  )
}
