import {IActivityTextContainer} from "../../ActivityTextContainer";
import cx from "classnames";
import React from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";


export const ActivityTextContainer = (props: IActivityTextContainer) => {
    const {fontConfig} = props;
    const {isMobile, isTablet} = useBreakpoint();
    return (
        <div className={'relative'}>
            <div
                style={{
                    background: "linear-gradient(180deg, var(--text-stroke-event-from), var(--text-stroke-event-from) 44.46%, var(--text-stroke-event-to) 70%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    WebkitTextStrokeColor: "#9A8F8B",
                    WebkitTextStrokeWidth: isMobile ? fontConfig?.fontStrokeWidth : fontConfig?.fontStrokeWidthForMobile,
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
                    WebkitTextStrokeColor: "#9A8F8B",
                    WebkitTextStrokeWidth: isMobile ? fontConfig?.fontStrokeWidth : fontConfig?.fontStrokeWidthForMobile,
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