import {ISVGComponent} from "../../../../../../../ISVGComponent";
import {environment} from "../../../../../../../../../environments/environment";
import cx from "classnames";

export const PhoneSvg = (props: ISVGComponent) => {
  return (
      <img className={cx("w-[20px] h-[20px]",props.className)} src={`assets/${environment.uVersion}/${props.icon}.png`} alt="Phone Icon" />
  )
}
