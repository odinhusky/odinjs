import cx from "classnames";
import {CacheImage} from "../../../components/image/CacheImage";
import {environment} from "../../../../../environments/environment";
import React, {SyntheticEvent, useState} from "react";

export interface IMenuDrawerCollapseButton {
  className?: string;
  containerClassName?: string;
  type?: "left" | "right";
  isOpenMenuDrawer: boolean;
  onClick?: () => void;
}

export const MenuDrawerCollapseButton = (props: IMenuDrawerCollapseButton) => {
  const {isOpenMenuDrawer, onClick} = props;
  const type = props?.type || 'left';
  const [hover, setHover] = useState(false);

  const closeImg = `assets/${environment.uVersion}/${environment.mVersion}/icon_menu_close_arrow.png`;
  const openImg = `assets/${environment.uVersion}/${environment.mVersion}/icon_menu_open_arrow.png`;
  const hoverImg = `assets/${environment.uVersion}/${environment.mVersion}/icon_menu_hover_left_arrow.png`;
  const widthAndReverseStyle = {width: '21px', transform: 'rotate(180deg)'};
  const widthStyle = {width: '21px'};
  const reverseStyle = {transform: 'rotate(180deg)'};

  return (
    <div className={cx(
      'flex items-center',
      `${isOpenMenuDrawer ? 'w-5' : 'w-8'}`,
      `${props?.containerClassName ?? ''}`
    )}>
      <button
        className={cx(
          'h-10 w-5',
          'bg-[var(--grayscale-20)]',
          // hover時背景樣式調整
          {
            'bg-[var(--state-success-main)]': !isOpenMenuDrawer && hover,
            'bg-[var(--state-warn-main)]': isOpenMenuDrawer && hover,
          },
          `${type === 'left'
              ? 'rounded-br-[4px] rounded-tr-[4px]'
              : `rounded-bl-[4px] rounded-tl-[4px] ${isOpenMenuDrawer ? '' : 'w-8 h-16'}`
        }`)}
        onClick={onClick && onClick}
        onMouseOver={() => {
          setHover(true);
        }}
        onMouseOut={() => {
          setHover(false)
        }}
      >
        {
          hover 
            ? (
              <CacheImage
                alt={'tab-icon'}
                style={
                  type === 'left' 
                    ? isOpenMenuDrawer 
                      ? widthStyle 
                      : widthAndReverseStyle
                    : isOpenMenuDrawer 
                      ? widthAndReverseStyle 
                      : widthStyle
                }
                src={hoverImg}
                className={cx('w-full h-4 px-1.5')}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.visibility = 'hidden'
                }}
              />
            ) : (
              <CacheImage
                alt={'tab-icon'}
                style={
                  type === 'left' 
                    ? {}
                    : isOpenMenuDrawer ? reverseStyle : widthAndReverseStyle
                }
                src={isOpenMenuDrawer ? closeImg : openImg}
                className={cx('w-full h-4 px-1.5')}
                onError={(e: SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.style.visibility = 'hidden'
                }}
              />
            )
        }
      </button>
    </div>
  )
}
