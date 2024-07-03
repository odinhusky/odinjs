import cx from "classnames";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";
import {IContainer} from "../../index";
import {twMerge} from "tailwind-merge";

export const PageContainer = (props: IContainer) => {
  const isY = typeof props.y === "undefined" ? true : props.y;
  const {isMobile} = useBreakpoint();
  return (
    <div
      id={props.id}
      className={twMerge(
        "page-core-container",
        // common
        "pt-5 pb-5",
        // mobile
        "px-4",
        // tablet (768px)
        "md:px-8",
        // desktop (1920px)
        "lg:box-content lg:max-w-[1200px] lg:mx-auto lg:px-24",
        props.className
      )}
      onClick={props.onClick}
    >{props.children}</div>
  )
}
