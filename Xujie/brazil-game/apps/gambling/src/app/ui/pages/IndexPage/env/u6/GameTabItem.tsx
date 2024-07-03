import cx from "../../../../utils/cx";
import {CacheImage} from "../../../../components/image/CacheImage";
import {SyntheticEvent} from "react";


type IGameTabItem = {
    isActive: boolean;
    icon?: string;
    name: string;
    count?: string
    onClick: () => void;
    className?: string;
    defIcon?: string;
    activeClassName?: string
    iconClassName? : string;
}

export const GameTabItem = (props: IGameTabItem) => {
    const {name,count, isActive, className, activeClassName = '', iconClassName= ''} = props;
    const iconSrc = props?.icon || '';
    const defIconSrc = props?.defIcon || '';

    return (
        <button
            className={cx(
                'flex flex-row justify-center items-center',
                className,
                isActive ? activeClassName : ''
            )}
            onClick={props.onClick}
        >

            {iconSrc && <CacheImage
                alt={'game-tab-icon'}
                src={iconSrc}
                defSrc={defIconSrc}
                className={cx(iconClassName)}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.style.visibility = 'hidden'
                    e.currentTarget.style.width = '0px';
                }}
            />}
            <div>{`${name === 'Todos' ? 'ALL' : name}${count ? count : ''}`}</div>
        </button>
    )
}
