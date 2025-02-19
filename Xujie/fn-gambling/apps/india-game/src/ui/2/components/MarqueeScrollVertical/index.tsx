import { cx } from '@libs/commonUtils';
import {
  FLEX_CENTER,
  FLEX_ITEMS_CENTER,
  PATTERN_BG,
} from '@libs/constant/style';
import { VoidAction } from '@libs/mode2/@types/commonTypes';
import Icon from '@components/Icon';
import { CSSProperties, forwardRef } from 'react';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

interface MarqueeScrollVerticalProps {
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
  hasDefaultStyle?: boolean;
}

export const MarqueeScrollVertical = forwardRef<
  HTMLDivElement,
  MarqueeScrollVerticalProps
>(
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
      hasDefaultStyle = true,
    },
    ref
  ) => {
    return (
      <div
        className={cx(
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
            backgroundPosition: '1rem 1rem',
          }}
          ref={ref}
        >
          <Swiper
            className={cx('w-full h-[38px]', marqueeClass)}
            slidesPerView={1}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            speed={1500} // 控制速度
            direction="vertical"
            loop={true}
            allowTouchMove={false}
            observeParents={false}
            modules={[Autoplay]}
          >
            {marqueeList &&
              marqueeList.map((item, index) => {
                return (
                  <SwiperSlide
                    key={`${item.id} - ${index}`}
                    className={cx('h-[38px]', FLEX_CENTER)}
                  >
                    <div className={cx(FLEX_ITEMS_CENTER)}>
                      {icon ? (
                        icon
                      ) : (
                        <Icon
                          className={cx('w-4 h-4 mr-2', iconClass)}
                          name="ic_volume"
                          color={
                            iconColor ? iconColor : 'var(--state-success-main)'
                          }
                        />
                      )}

                      <div
                        className={cx(
                          'scroll-item',
                          'inline-block',
                          'text-sm leading-[20px]',
                          'bgi-text-[var(--grayscale-100)]',
                          'h-[38px]',
                          'pr-5',
                          'transition-colors',
                          'duration-1000',
                          FLEX_CENTER,
                          marqueeUnitClass
                        )}
                        style={marqueeUnitStyle}
                        onClick={() => {
                          item?.action?.();
                        }}
                      >
                        {item.broadcastText}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      </div>
    );
  }
);

export default MarqueeScrollVertical;
