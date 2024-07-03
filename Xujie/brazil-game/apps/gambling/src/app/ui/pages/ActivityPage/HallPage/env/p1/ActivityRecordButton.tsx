import cx from "classnames";
import ArrowRight from "../../DailySignInPage/env/u2/images/ArrowRight.png";
import {IActivityRecordButton} from "../../ActivityRecordButton";

export const ActivityRecordButton = (props: IActivityRecordButton) => {

    return (
        <button
            className={cx(""
                , props.className)}
            onClick={props.onClick && props.onClick}
        >
            {props.name}
        </button>
    )
}