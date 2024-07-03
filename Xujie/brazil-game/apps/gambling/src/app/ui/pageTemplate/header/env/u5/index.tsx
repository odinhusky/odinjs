import React from "react";
import useBreakpoint from "../../../hooks/useBreakpoint";
import {renderByRWD} from "../../../../utils/renderByRWD";
import {IHeader} from "../../types/IHeader";
import {IMobileHeader} from "../../types/IMobileHeader";
import {Header as SharedHeader} from "./Header";
export const Header = (props: IHeader | IMobileHeader) => {
  const device = useBreakpoint();
  return (
    <>
      {renderByRWD({
        shared: (
          <SharedHeader {...props as IHeader}/>
        ),
      }, device)}
    </>
  )
}
