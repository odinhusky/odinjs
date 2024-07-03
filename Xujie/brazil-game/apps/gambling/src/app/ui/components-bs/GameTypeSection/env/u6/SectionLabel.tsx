import cx from "../../../../utils/cx";
import {CacheImage} from "../../../../components/image/CacheImage";
import {SyntheticEvent} from "react";

type ISectionLabel = {
    label?: string;
    className?: string;
    iconSrc?: string;
    iconClassName?: string;
}
export const SectionLabel = (props: ISectionLabel) => {
    const {label, className, iconSrc, iconClassName} = props;
    return (
        <div
            className={cx(
                'flex flex-row justify-center items-center',
                className,
            )}
        >
            <CacheImage
                alt={'section-label-icon'}
                src={iconSrc || ''}
                className={cx(iconClassName)}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.visibility = 'hidden'
                    e.currentTarget.style.width = '0px';
                }}
            />
            <div>{label ? label : ''}</div>
        </div>
    )
}