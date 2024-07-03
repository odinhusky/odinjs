import { ReactNode, useState } from 'react';
import cx from '../../utils/cx';
import { FLEX_CENTER } from 'apps/gambling/src/assets/constant/style';

interface BaseBtnProps {
  isActive?: boolean;
  hoverClass?: string;
  activeClass?: string;
  activeBgClass?: string;
  btnClass?: string;
  childrenClass?: string;
  children?: ReactNode;
  topIcon?: ReactNode;
  topContainerClass?: string;
  leftIcon?: ReactNode;
  leftContainerClass?: string;
  rightIcon?: ReactNode;
  rightContainerClass?: string;
  bottomIcon?: ReactNode;
  bottomContainerClass?: string;
  btnCenterClass?: string;
  onClick?: <T>(arg?: T) => void;
}

export const BaseBtn = ({
  isActive,
  hoverClass = '',
  activeClass = '',
  activeBgClass = 'bg-linear-4-main',
  btnClass = '',
  childrenClass = '',
  children,
  topIcon,
  topContainerClass = '',
  leftIcon,
  leftContainerClass = '',
  rightIcon,
  rightContainerClass = '',
  bottomIcon,
  bottomContainerClass = '',
  btnCenterClass = '',
  onClick
}: BaseBtnProps) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      className={cx(
        'box-border',
        'w-full h-auto',
        'p-3',
        'rounded-lg',
        'border border-white',
        FLEX_CENTER,
        `${hover ? hoverClass : ''}`,
        `${isActive ? activeBgClass : ''}`,
        `${active ? activeClass : ''}`,
        {
          'border-0': isActive || active,
        },
        btnClass,
      )}
      onMouseOver={() => { setHover(true); }}
      onMouseOut={() => { setHover(false); }}
      onMouseDown={() => { setActive(true); }}
      onMouseUp={() => { setActive(false); }}
      onTouchStart={() => { setActive(true); }}
      onTouchEnd={() => { setActive(false); }}
      onClick={onClick}
    >
      {topIcon ? (
        <div className={cx('mb-2', FLEX_CENTER, topContainerClass)}>{topIcon}</div>
      ) : null}

      <div className={cx(FLEX_CENTER, btnCenterClass)}>
        {/* Left Icon */}
        {
          leftIcon ? (
            <div className={cx('mr-2', FLEX_CENTER, leftContainerClass)}>
              {leftIcon}
            </div>
          ) : null
        }

        {/* Children */}
        <div className={cx(
          'text-[var(--grayscale-90)]',
          {
            'text-white': isActive
          },
          childrenClass
        )}>
          {children}
        </div>

        {/* Right Icon */}
        {
          rightIcon ? (
            <div className={cx('ml-2', FLEX_CENTER,rightContainerClass)}>
              {rightIcon}
            </div>
          ) : null
        }  
      </div>

      {bottomIcon ? (
        <div className={cx('mt-2', FLEX_CENTER, bottomContainerClass)}>{bottomIcon}</div>
      ) : null}
    </button>
  )
}

export default BaseBtn;