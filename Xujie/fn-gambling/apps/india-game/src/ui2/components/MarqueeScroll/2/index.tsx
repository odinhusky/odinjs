import { cx } from '@libs/commonUtils';
import { FLEX_ITEMS_CENTER } from '@libs/constant/style';
import Icon from '@components/Icon';
import { forwardRef } from 'react';
import Marquee from 'react-fast-marquee';
import { MarqueeScrollProps } from '../MarqueeScrollProps';

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
          hasDefaultStyle ? cx('bgi-[var(--linear-1)]') : '',
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
            className={cx('w-4 h-4 mr-2', iconClass)}
            name="ic_volume"
            color={iconColor ? iconColor : 'var(--state-success-main)'}
          />
        )}

        <div
          className={cx(
            'overflow-hidden',
            'whitespace-nowrap',
            'w-full',
            marqueeContainerClass
          )}
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
