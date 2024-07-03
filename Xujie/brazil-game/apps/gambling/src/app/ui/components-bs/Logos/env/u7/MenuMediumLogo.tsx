import {environment} from "../../../../../../environments/environment";
import React from "react";
import {ILogo} from "../types";
import cx from "classnames";
import {CacheImage} from "../../../../components/image/CacheImage";

export const MenuMediumLogo = (props: ILogo) => {
  return (
    <CacheImage
      alt={'logo-menu'}
      src={`assets/${environment.uVersion}/${environment.mvVersion}/logo.png`}
      className={cx("w-[102px] h-[40px]", props.className)}
    />
  )
}
