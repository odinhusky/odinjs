import cx from 'classnames';
import React, { SyntheticEvent, useState } from 'react';
import { CacheImage } from '../../../../components/image/CacheImage';

export interface IMenuDrawerItem {
  item: string;
  des: string;
  isFocus: boolean;
  className?: string;
  textClassName?: string;
  icon?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}

export const MenuDrawerItem = (props: IMenuDrawerItem) => {
  const {
    item,
    className = '',
    textClassName,
    icon,
    onClick,
    badge,
    des,
    isFocus,
  } = props;
  const iconSrc = props?.icon || '';

  return (
    <button
      id="license"
      className={cx(
        'relative flex group gap-2 text-sm w-full h-12 font-medium text-[var(--grayscale-70)] hover:text-[var(--grayscale-100)]',
        'items-center border-solid border-[var(--grayscale-70)]',
        className,
        {
          'bg-tab-bar-variant border-r-[3px]': isFocus,
        }
      )}
      onClick={onClick && onClick}
    >
      <div className="absolute bg-tab-bar-variant w-full h-full hidden group-hover:block" />
      <CacheImage
        className="w-5 h-5 ml-4"
        alt={'tab-icon'}
        src={iconSrc}
        onError={(e: SyntheticEvent<HTMLImageElement>) => {
          console.log(`load game type icon fail`, `item = ${item}`, e);
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
      <div
        className={cx('w-full text-left', textClassName, {
          'text-[var(--grayscale-100)]': isFocus,
        })}
      >
        <div>
          {item} <span className="text-important font-medium">{des}</span>
        </div>
      </div>

      {/* <div className={'absolute top-0 right-0'}>{badge ? badge : null}</div> */}
    </button>
  );
};
