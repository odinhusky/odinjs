import cx from "../../../../utils/cx";
import {CacheImage} from "../../../../components/image/CacheImage";
import {SyntheticEvent} from "react";


type IGameProviderTabItem = {
    isActive: boolean;
    icon: string;
    name: string;
    onClick: () => void;
    className?: string;
    activeClassName?: string
    iconClassName?: string;
}

export const GameProviderTabItem = (props: IGameProviderTabItem) => {
    const {name, isActive, className, activeClassName = '', iconClassName = ''} = props;
    const iconSrc = props?.icon || '';

    return (
        <button
            className={cx(
                'flex flex-row justify-center items-center',
                className,
                isActive ? activeClassName : ''
            )}
            onClick={props.onClick}
        >

            <CacheImage
                alt={name}
                src={iconSrc}
                className={cx(iconClassName)}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.visibility = 'hidden'
                    e.currentTarget.style.width = '0px';
                }}
            >
                {name}
            </CacheImage>
        </button>
    )
}
