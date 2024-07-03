import { useEffect, useState } from "react";
import { useActivityNotice } from "../../pages/ActivityPage/hooks/useActivityNotice";
import { isEmpty } from "lodash";
import cx from "../../utils/cx";

type IActivityBadge = {
  activityType?: string;
  className?: string;
}

export const ActivityBadge = (props: IActivityBadge) => {
  const {activityType, className} = props;
  const {noticeState} = useActivityNotice();
  const [isShowBadge, setIsShowBadge] = useState<boolean>(false);

  useEffect(() => {
    if(isEmpty(noticeState)) return;
    if (activityType) {
      setIsShowBadge(noticeState[activityType])
    } else {
      const trueCount = Object.values(noticeState).filter(value => value).length
      setIsShowBadge(trueCount > 0);
    }
  }, [noticeState, activityType])

  return (
    isShowBadge ? (
      <div
        className={cx(
          'w-3 h-3 rounded-full bg-red-500',
          className
        )}
      ></div>
    ) : null
  )
}