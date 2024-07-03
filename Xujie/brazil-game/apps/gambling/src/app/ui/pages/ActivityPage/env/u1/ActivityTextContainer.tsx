import {IActivityTextContainer} from "../../ActivityTextContainer";
import cx from "classnames";
import React from "react";


export const ActivityTextContainer = (props: IActivityTextContainer) => {
    const {fontConfig} = props;
    return (
        <div
            className={'relative'}>
            <div
                style={{
                    background: "linear-gradient(180deg, var(--text-stroke-event-from) 50%, var(--text-stroke-event-to) 50%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontFamily: fontConfig?.fontFamily,
                    fontWeight: fontConfig?.fontWeight,
                    fontStyle: fontConfig?.fontStyle,
                    letterSpacing: fontConfig?.fontLetterSpacing,
                    padding: "3px",
                    margin: "-3px"
                }}
                className={cx('absolute', props.className)}>
                {`${props.children}`}&nbsp;
            </div>

            <div
                style={{
                    color: "white",
                    textShadow: '1px 2px 6px var(--activity-text-shadow-90)',
                    fontFamily: fontConfig?.fontFamily,
                    fontWeight: fontConfig?.fontWeight,
                    fontStyle: fontConfig?.fontStyle,
                    letterSpacing: fontConfig?.fontLetterSpacing,
                    padding: "3px",
                    margin: "-3px"
                }}
                className={cx('', props.className)}>
                {`${props.children}`}&nbsp;
            </div>
        </div>
    )
}