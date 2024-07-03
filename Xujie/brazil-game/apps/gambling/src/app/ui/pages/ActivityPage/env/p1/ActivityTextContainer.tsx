import {IActivityTextContainer} from "../../ActivityTextContainer";
import cx from "classnames";
import React from "react";
import useBreakpoint from "../../../../pageTemplate/hooks/useBreakpoint";


export const ActivityTextContainer = (props: IActivityTextContainer) => {
    const {fontConfig} = props;
    const {isMobile} = useBreakpoint();
    return (
        <div className={'relative'}>
            <div
                style={{
                    ...props.style,
                    background: "linear-gradient(180deg, #FFFFFF, #FFFB72 44.46%, #F19C03 70%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    WebkitTextStrokeColor: "#F7739B",
                    WebkitTextStrokeWidth: isMobile ? fontConfig?.fontStrokeWidth : fontConfig?.fontStrokeWidthForMobile,
                    fontFamily: fontConfig?.fontFamily,
                    fontWeight: fontConfig?.fontWeight,
                    fontStyle: fontConfig?.fontStyle,
                    letterSpacing: fontConfig?.fontLetterSpacing,
                    padding: "1px",
                    margin: "-1px"
                }}
                className={cx('absolute', props.className)}>
                {`${props.children}`}&nbsp;
            </div>

            <div
                style={{
                    ...props.style,
                    color: "white",
                    WebkitTextStrokeColor: "#F7739B",
                    WebkitTextStrokeWidth: isMobile ? fontConfig?.fontStrokeWidth : fontConfig?.fontStrokeWidthForMobile,
                    textShadow: '1px 2px 6px var(--activity-text-shadow-90)',
                    fontFamily: fontConfig?.fontFamily,
                    fontWeight: fontConfig?.fontWeight,
                    fontStyle: fontConfig?.fontStyle,
                    letterSpacing: fontConfig?.fontLetterSpacing,
                    padding: "1px",
                    margin: "-1px"
                }}
                className={cx('', props.className)}>
                {`${props.children}`}&nbsp;
            </div>

        </div>
    )
}