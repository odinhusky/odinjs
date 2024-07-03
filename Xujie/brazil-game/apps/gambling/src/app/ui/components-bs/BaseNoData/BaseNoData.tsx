import cx from "apps/gambling/src/app/ui/utils/cx";
import t from "apps/gambling/src/assets/constant/lang";
import { environment } from "apps/gambling/src/environments/environment";
import { renderByUVersion } from "../../utils/renderByUVersion";
import { default as  U6BaseNoDataNode} from "./env/u6/BaseNoDataNode";
import { default as  U7BaseNoDataNode} from "./env/u7/BaseNoDataNode";

interface BaseNoDataProps {
  className?: string;
}

export const BaseNoData = ({
  className
}: BaseNoDataProps) => {
  return (
    renderByUVersion(
      {
        "u6": <U6BaseNoDataNode className={className} />,
        "u7": <U7BaseNoDataNode className={className} />,
      },
      <U6BaseNoDataNode className={className} />,
    )
  )
}

export default BaseNoData;