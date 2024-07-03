import cx from "classnames";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {IContainer} from "../../index";
import { twMerge } from "tailwind-merge";

export const PageContainer = (props: IContainer) => {
  const isY = typeof props.y === "undefined" ? true : props.y;
  const {isMobile} = useBreakpoint();
  return (
    <div
      id={props.id}
      className={twMerge(
        isMobile && 'px-4',
        (isMobile && isY) && 'py-2',
        !isMobile && 'px-[84px]',
        (!isMobile && isY) && 'py-4',
        props.className
      )}
      onClick={props.onClick}
    >{props.children}</div>
  )
}
