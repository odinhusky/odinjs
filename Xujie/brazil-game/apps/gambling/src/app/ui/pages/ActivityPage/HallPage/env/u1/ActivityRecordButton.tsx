
import cx from "../../../../../utils/cx";
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