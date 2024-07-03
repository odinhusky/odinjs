import { SyntheticEvent, useEffect, useState } from 'react';
import { CacheImage } from '../../../../components/image/CacheImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { useLocation } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';
import cx from '../../../../utils/cx';

export interface IMenuDrawerGameItem {
  item: string;
  className?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
}

type IMouseEvent = 'Enter' | 'Leave' | 'Click';

export const MenuDrawerGameItem = (props: IMenuDrawerGameItem) => {
  const { item, className = '', onClick = () => {} } = props;
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );
  const [isSelect, setIsSelect] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === PageOrModalPathEnum.IndexPage) {
      setIsSelect(item === indexPagecurrentSelectLabel);
    } else {
      setIsSelect(false);
    }
  }, [indexPagecurrentSelectLabel, location.pathname]);

  return (
    <button
      className={cx(
        'h-[72px] linear-3-menu-button',
        'hover:brightness-125',
        className,
        {}
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      <div
        className={cx(
          'w-full h-full flex flex-col justify-center items-center',
          isSelect ? 'menu-focus' : ''
        )}
      >
        <CacheImage
          alt={'tab-icon'}
          src={iconSrc}
          defSrc={defIconSrc}
          className={cx(
            'w-8 h-8  hover:brightness-100',
            isSelect ? 'brightness-100' : 'brightness-75'
          )}
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        <div className={cx('text-center')}>{item}</div>
      </div>
    </button>
  );
};
