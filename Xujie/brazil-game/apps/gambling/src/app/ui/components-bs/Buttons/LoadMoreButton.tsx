import { renderByUVersion } from "../../utils/renderByUVersion"
import { LoadMoreButton as CLoadMoreButton } from "./env/u1/LoadMoreButton"
import { LoadMoreButton as RLoadMoreButton } from "./env/u2/LoadMoreButton"
import { LoadMoreButton as U5LoadMoreButton } from "./env/u5/LoadMoreButton"


export const LoadMoreButton = (props: { onClick: () => void }) => {
  return renderByUVersion({
    "u1": <CLoadMoreButton  {...props} />,
    "u2": <RLoadMoreButton {...props} />,
    "u5": <U5LoadMoreButton {...props} />
  }, <CLoadMoreButton  {...props} />)
}

