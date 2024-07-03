import {environment} from "../../../../../../environments/environment";
import React from "react";
import {twMerge} from "tailwind-merge";
import {CacheImage} from "../../../../components/image/CacheImage";
import cx from "classnames";

type IMenuSmallLogo = {
  className?: string;
}
export const MenuSmallLogo = (props: IMenuSmallLogo) => {
  return (
    <CacheImage
      alt={'logo-menu'}
      src={`assets/${environment.uVersion}/${environment.mvVersion}/logo_m.png`}
      className={cx("w-[32xp] h-[32px]", props.className)}
    />
  )
}
