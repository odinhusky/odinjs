import cx from "classnames";

import {IActivityRecordButton} from "../../ActivityRecordButton";
import useBreakpoint from "../../../../../pageTemplate/hooks/useBreakpoint";


export const ActivityRecordButton = (props: IActivityRecordButton) => {
    const {isMobile, isTablet, isDesktop} = useBreakpoint();
    return (
        <button
            className={cx(
                'flex gap-2 items-center justify-center rounded-full',
                'shadow-[inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.25),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.25)]',
                'text-[var(--grayscale-100)] font-extrabold',
                {'text-base py-3 px-10': isDesktop},
                {'text-base py-2.5 px-7': isTablet},
                {'text-sm py-2.5 px-6': isMobile},
                props.className
            )}
            onClick={props.onClick && props.onClick}
        >
            <div className={'drop-shadow-lg'}>{props.name}</div>
        </button>

    )
}