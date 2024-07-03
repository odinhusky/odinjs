import cx from "classnames";
import React, {SyntheticEvent, useState} from "react";
import {CacheImage} from "../../../../components/image/CacheImage";


export interface IMenuDrawerItem {
  item: string;
  className?: string;
  textClassName?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
  badge?: React.ReactNode;
}


export const MenuDrawerItem = (props: IMenuDrawerItem) => {
  const {item, className = '', icon, onClick,badge} = props;
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  const [hover, setHover] = useState(false);


  return (
    <div className={"w-full flex flex-col px-5"}
    >

      <button
        className={cx(className,
          'min-h-[44px] items-center relative',
          'shadow-[0px_4px_4px_0px_rgba(38,_33,_44,_1.0),_inset_0px_-4px_4px_0px_rgba(0,_0,_0,_0.4),_inset_0px_4px_4px_0px_rgba(255,_255,_255,_0.4)]',
          'bg-[var(--grayscale-25)] text-[var(--grayscale-70)]',
          'hover:shadow',
          'focus:shadow',
          'active:shadow',
          'hover:bg-[var(--grayscale-15)] hover:text-[rgb(255,255,255)]',
          'focus:bg-[var(--grayscale-15)] hover:text-[rgb(255,255,255)]',
          'active:bg-[var(--grayscale-15)] hover:text-[rgb(255,255,255)]',

          // 'border-[1.5px] hover:border-[var(--grayscale-30)] border-[rgba(0,_0,_0,_0.0)]',
          'rounded-full', {})}
        onClick={onClick && onClick}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false);
        }}
      >

        <div
          className={cx(
            'h-[28px] w-[28px] aspect-square',
            'flex flex-col items-center justify-center',
            'shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_.25)]',
            'rounded-full bg-[var(--grayscale-40)]',
            'ml-4'
          )}>
          <CacheImage
            alt={'tab-icon'}
            src={iconSrc}
            defSrc={defIconSrc}
            className={'w-[22px] h-[22px]'}
            onError={(e: SyntheticEvent<HTMLImageElement>) => {
              console.log(`load game type icon fail`, `item = ${item}`, e)
              e.currentTarget.style.visibility = 'hidden'
            }}
          />
        </div>

        {/*justify-between*/}
        <div className={`flex flex-row text-sm font-medium leading-[20px] text-left mr-4 w-full ${props?.textClassName}`}>
          <div>{item}</div>
        </div>

        <div className={'justify-end'}>{badge ? badge : null}</div>

        {hover &&
          <div
            className={cx('rounded-full absolute h-full w-full border border-[var(--grayscale-30)] items-center justify-center')}
          />}

      </button>

    </div>
  )
}
