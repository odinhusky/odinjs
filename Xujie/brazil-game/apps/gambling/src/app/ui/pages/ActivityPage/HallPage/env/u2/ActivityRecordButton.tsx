import cx from "classnames";

import {IActivityRecordButton} from "../../ActivityRecordButton";
import {environment} from "../../../../../../../environments/environment";
import {CacheImage} from "../../../../../components/image/CacheImage";


export const ActivityRecordButton = (props: IActivityRecordButton) => {

    return (
        <button
            className={cx(
                'flex gap-2 items-center justify-center py-[10px] px-5',
                'rounded-full shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
                'text-[var(--grayscale-100)] bg-[var(--secondary-main)]'
            )}
            onClick={props.onClick && props.onClick}
        >
            <div>{props.name}</div>
            <CacheImage
                alt={props.name}
                className={'w-5 h-5 lg:w-6 lg:h-6'}
                src={`assets/${environment.uVersion}/icon_arrow_right.png`}
            />
        </button>

    )
}