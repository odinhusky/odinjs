import cx from "../../../../utils/cx";
import {IActivityTextContainer} from "../../ActivityTextContainer";


export const ActivityTextContainer = (props: IActivityTextContainer) => {
    const {fontConfig} = props;
    return (
        <div
            style={props.style}
            className={cx('relative')}>
            <div
                style={{
                    // background: "linear-gradient(180deg, #FFFFFF 50%, #D6D5CA 50%), linear-gradient(180deg, #FFFFFF 50%, #D8D8D8 50%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "var(--grayscale-100)",
                    fontFamily: fontConfig?.fontFamily,
                    fontWeight: fontConfig?.fontWeight,
                    fontStyle: fontConfig?.fontStyle,
                    letterSpacing: fontConfig?.fontLetterSpacing,
                    // padding: "3px",
                    // margin: "-3px",
                    textShadow: '0px 4px 4px #00000025',
                }}
                className={cx('', props.className)}>
                {`${props.children}`}&nbsp;
            </div>
        </div>
    )
}