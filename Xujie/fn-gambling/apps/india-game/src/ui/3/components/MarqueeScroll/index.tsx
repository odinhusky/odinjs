import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER, PATTERN_BG } from '@libs/constant/style';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import Icon from '@components/Icon';
import { CSSProperties, forwardRef } from 'react';
import Marquee, { MarqueeProps } from 'react-fast-marquee';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';

interface MarqueeScrollProps {
  icon?: React.ReactNode;
  iconColor?: string;
  iconClass?: string;
  containerClass?: string;
  marqueeContainerClass?: string;
  marqueeClass?: string;
  marqueeUnitStyle?: CSSProperties;
  marqueeUnitClass?: string;
  marqueeList: {
    id: string | number;
    broadcastText: string;
    action?: VoidAction;
  }[];
  marqueeProps?: Omit<MarqueeProps, 'className'>;
  hasDefaultStyle?: boolean;
}

export const MarqueeScroll = forwardRef<HTMLDivElement, MarqueeScrollProps>(
  (
    {
      icon,
      iconColor,
      iconClass,
      containerClass,
      marqueeContainerClass,
      marqueeClass,
      marqueeList,
      marqueeUnitClass,
      marqueeUnitStyle,
      marqueeProps,
      hasDefaultStyle = true,
    },
    ref
  ) => {
    const defaultMarqueeProps = {
      speed: 30,
      autoFill: true,
    };

    const mixMarqueeProps = {
      ...defaultMarqueeProps,
      ...marqueeProps,
    };

    return (
      <div
        className={cx(
          FLEX_ITEMS_CENTER,
          'relative',
          hasDefaultStyle ? cx('bgi-[var(--linear-6)]') : '',
          containerClass
        )}
      >
        {/* 線條 */}
        {hasDefaultStyle ? (
          <>
            <div className={cx('gradient-top-line', '!h-px')}></div>
            <div className={cx('gradient-line', '!h-px')}></div>
          </>
        ) : null}

        {icon ? (
          icon
        ) : (
          <Icon
            className={cx('w-5 h-5 mr-2', iconClass)}
            name="ic_volume" // TODO Icon
          />
        )}

        <div
          className={cx(
            'overflow-hidden',
            'whitespace-nowrap',
            'w-full',
            PATTERN_BG,
            marqueeContainerClass
          )}
          style={{
            backgroundImage: `url(${getImgUrl(EResourceLevel.V, 'pattern')})`,
            backgroundSize: '40rem 40rem',
            backgroundPosition: 'top left',
          }}
          ref={ref}
        >
          <Marquee {...mixMarqueeProps} className={cx(marqueeClass)}>
            {marqueeList &&
              marqueeList.map((item, index) => {
                return (
                  <div
                    className={cx(
                      'scroll-item',
                      'inline-block',
                      'text-sm leading-[30px]',
                      'bgi-text-[var(--grayscale-100)]',
                      'h-[30px]',
                      'pr-5',
                      'transition-colors',
                      'duration-1000',
                      marqueeUnitClass
                    )}
                    key={`${item.id} - ${index}`}
                    style={marqueeUnitStyle}
                    onClick={() => {
                      item?.action?.();
                    }}
                  >
                    {item.broadcastText}
                  </div>
                );
              })}
          </Marquee>
        </div>
      </div>
    );
  }
);

export default MarqueeScroll;
