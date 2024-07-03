import { environment } from "../../../../environments/environment";
import cx from "../../utils/cx";
import "./index.scss";

type IScrollBar = {
  className?: string;
  children: React.ReactNode;
}

export const ScrollBar = (props: IScrollBar) => {
  return (
    <div className={cx(`${environment.uVersion}-custom-scrollbar-style`, props.className)}>{props.children}</div>
  )
}