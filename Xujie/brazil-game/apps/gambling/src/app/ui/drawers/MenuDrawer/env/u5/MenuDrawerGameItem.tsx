import cx from 'classnames';
import { SyntheticEvent, useEffect, useState } from 'react';
import { CacheImage } from '../../../../components/image/CacheImage';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../reduxStore';
import { useLocation } from 'react-router';
import { PageOrModalPathEnum } from '../../../../PageOrModalPathEnum';
import useBreakpoint from '../../../../pageTemplate/hooks/useBreakpoint';

export interface IMenuDrawerGameItem {
  item: string;
  index: number;
  className?: string;
  icon?: string;
  defIcon?: string;
  onClick?: () => void;
}

type IMouseEvent = 'Enter' | 'Leave' | 'Click';

const bgColorMap: { [key: number]: string[] } = {
  1: ['linear-1-button'],
  2: ['linear-2-button'],
  3: ['linear-3-button'],
  4: ['linear-4-button'],
  5: ['linear-5-button'],
  6: ['linear-6-button'],
};

export const MenuDrawerGameItem = (props: IMenuDrawerGameItem) => {
  const { index, item, className = '', onClick = () => {} } = props;
  const iconSrc = props?.icon || '';
  const defIconSrc = props?.defIcon || '';
  const [mouseEvent, setMouseEvent] = useState<IMouseEvent>('Leave');
  const indexPagecurrentSelectLabel = useSelector(
    (state: RootState) => state.gameList.indexPagecurrentSelectLabel
  );
  const [isSelect, setIsSelect] = useState(false);
  const bgColors: string[] = bgColorMap[(index % 6) + 1];
  const location = useLocation();
  const { isTablet, isMobile } = useBreakpoint();

  useEffect(() => {
    if (location.pathname === PageOrModalPathEnum.IndexPage) {
      setIsSelect(item === indexPagecurrentSelectLabel);
    } else {
      setIsSelect(false);
    }
  }, [indexPagecurrentSelectLabel, mouseEvent, location.pathname]);

  return (
    <button
      className={cx(
        className,
        bgColors,
        'shadow-[0px_2px_2px_0px_rgba(38,_33,_44,_1.0),_inset_0px_-2px_2px_0px_rgba(0,_0,_0,_0.4),_inset_0px_2px_2px_0px_rgba(255,_255,_255,_0.4)]',
        'rounded-full',
        'text-[12px] lg:text-[0px] lg:hover:text-[12px] lg:active:text-[12px]',
        isSelect ? 'border-[1.5px] border-[var(--grayscale-100)]' : '',
        {}
      )}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      onMouseEnter={() => {
        setMouseEvent('Enter');
      }}
      onMouseLeave={() => {
        setMouseEvent('Leave');
      }}
    >
      <div className={cx('flex flex-col items-center')}>
        <CacheImage
          alt={'tab-icon'}
          src={iconSrc}
          defSrc={defIconSrc}
          className={cx(
            mouseEvent === 'Enter' ||
              mouseEvent === 'Click' ||
              isTablet ||
              isMobile
              ? 'w-[16px] h-[16px]'
              : 'w-[24px] h-[24px]'
          )}
          onError={(e: SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.style.visibility = 'hidden';
          }}
        />
        <div className={cx('text-[var(--grayscale-100)] text-center')}>
          {item}
        </div>
      </div>
    </button>
  );
};
