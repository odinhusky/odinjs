import {twMerge} from "tailwind-merge";
import {ConfirmButton as COCOConfirmButton } from "../../Buttons/ConfirmButton";
import {renderByUVersion} from "../../../utils/renderByUVersion";
import cx from "classnames";

type IButton = {
  children: React.ReactNode;
  disable?: boolean;
  className?: string;
}
const RiojungleConfirmButton = (props: IButton) => {
  return (
    <button
      className={twMerge(
        "rounded-lg",
        "shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]",
        "bg-[var(--primary-main)]",
        "w-full",
        "py-3",
        "text-sm md:text-base lg:text-lg text-white",
        props.disable ? "cursor-not-allowed" : "cursor-pointer" ,
        "flex flex-row justify-center",
        props.disable && "opacity-[0.7]"
      )}
    >{props.children}</button>
  )
}


const CocoConfirmButton = (props: IButton) => {
  return (
    <COCOConfirmButton className={cx("!w-full text-sm md:text-base my-2", props.className)}>{props.children}</COCOConfirmButton>
  )
}

const U5ConfirmButton = (props: IButton) => {
  return (
    <button
      className={cx(
        'state-info-button text-sm lg:text-base  mb-3 md:mb-8 lg:mb-8 w-full h-10 lg:h-12 font-bold flex justify-center items-center',
        props.disable && "opacity-[0.7]"
      )}
    >{props.children}</button>
  )
}

const U6ConfirmButton = (props: IButton) => {
  return (
    <button
      className={cx(
        'w-full h-9 lg:h-12 text-sm lg:text-base font-bold lg:font-medium',
        'linear-1-button shadow-button rounded-lg',
        props.disable && "opacity-[0.7]"
      )}
    >{props.children}</button>
  )
}

export const ConfirmButton = (props: IButton) => {
  return renderByUVersion({
    "u1": <CocoConfirmButton {...props}/>,
    "u2": <RiojungleConfirmButton {...props}/>,
    "u5": <U5ConfirmButton {...props}/>,
    "u6": <U6ConfirmButton {...props}/>,
  }, <CocoConfirmButton {...props}/>)
}
