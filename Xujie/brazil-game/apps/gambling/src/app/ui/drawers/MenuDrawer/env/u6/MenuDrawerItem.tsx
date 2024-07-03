import cx from "classnames";
import React, {SyntheticEvent, useState} from "react";
import {CacheImage} from "../../../../components/image/CacheImage";


export interface IMenuDrawerItem {
    item: string;
    className?: string;
    textClassName?: string;
    icon?: string;
    onClick?: () => void;
    badge?: React.ReactNode;
}


export const MenuDrawerItem = (props: IMenuDrawerItem) => {
    const {item, className = '', textClassName, icon, onClick, badge} = props;
    const iconSrc = props?.icon || '';


    return (
        <button
            className={cx(
                'text-sm text-center text-[var(--grayscale-100)] font-medium',
                'h-[72px] min-h-[72px] items-center relative rounded-lg',
                'active:brightness-75 hover:brightness-125',
                className)}
            onClick={onClick && onClick}
        >

            <CacheImage
                className={cx(
                    'w-full h-full aspect-square absolute bottom-0 object-scale-down'
                )}
                alt={'tab-icon'}
                src={iconSrc}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                    console.log(`load game type icon fail`, `item = ${item}`, e)
                    e.currentTarget.style.visibility = 'hidden'
                }}
            />
            <div
                className={cx(
                    'w-full absolute top-1 ',
                    textClassName
                )}>
                <div>{item}</div>
            </div>

            <div className={'absolute top-0 right-0'}>{badge ? badge : null}</div>

        </button>
    )
}
