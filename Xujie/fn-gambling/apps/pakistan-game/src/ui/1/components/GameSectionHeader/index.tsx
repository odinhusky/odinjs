import { useTranslation } from 'react-i18next';
import { Swiper as SwiperClass } from 'swiper/types';
import { cx, useBreakPoint } from '@libs/commonUtils';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@mode2/components/Icon';
import { useEffect, useState } from 'react';
import BasePrimaryOutlineBtn from '@components/BasePrimaryOutlineBtn';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

interface GameSectionHeaderProps {
  iconSrc: string;
  title: I18NContent;
  amount: number;
  isShowAmount: boolean;
  isShowSlideBtn: boolean;
  swiperRef?: React.RefObject<SwiperClass | null>;
  onAmountClick: () => void;
  lineClassName?: string;
  isSupplierGame?: boolean;
  isCollapse?: boolean;
  toggleCollapse?: () => void;
}
const GameSectionHeader = (props: GameSectionHeaderProps) => {
  const { t } = useTranslation();
  const { isMobile } = useBreakPoint();

  const slideBtnClass =
    'px-2 h-7 flex justify-center items-center rounded-lg bgi-[var(--grayscale-20)] disabled:bgi-[var(--transparent-gray-30)] hover:bgi-[var(--grayscale-15)] active:bgi-[var(--grayscale-00)]';

  const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState(true);
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);

  const [iconColor, setIconColor] = useState('var(--grayscale-50)');

  const handleSlidePrev = () => {
    if (props.swiperRef?.current) {
      props.swiperRef.current.slidePrev();
    }
  };

  const handleSlideNext = () => {
    if (props.swiperRef?.current) {
      props.swiperRef.current.slideNext();
    }
  };

  /**
   * 使用 effect 監聽 slideChange 和 transitionEnd 事件
   * 及時獲取最新狀態,避免滑動狀態更新不及時與畫面顯示不同步造成的延遲感
   * 原先直接使用props.swiperRef?.current.isBeginning當顯示的判斷條件時,可能會因為需要等待滑動動畫結束以及等待重新計算狀態而導致延遲
   */
  useEffect(() => {
    const swiper = props.swiperRef?.current;

    const updateButtonState = () => {
      setIsPrevBtnDisabled(swiper?.isBeginning || false);
      setIsNextBtnDisabled(swiper?.isEnd || false);
    };

    // Swiper 提供的 slideChange 和 transitionEnd 事件
    if (swiper) {
      swiper.on('slideChange', updateButtonState);
      swiper.on('transitionEnd', updateButtonState);
    }

    return () => {
      if (swiper) {
        swiper.off('slideChange', updateButtonState);
        swiper.off('transitionEnd', updateButtonState);
      }
    };
  }, [props.swiperRef]);

  const Amount = () => {
    return (
      <div
        className={cx('flex items-center')}
        onMouseOver={() => setIconColor('var(--grayscale-40)')}
        onMouseOut={() => setIconColor('var(--grayscale-50)')}
        onMouseDown={() => setIconColor('var(--base-1-main)')}
        onMouseUp={() => setIconColor('var(--grayscale-50)')}
      >
        <div className='flex gap-1'>
          <span>{t('home_btn_all')}</span>
          <span className="bgi-text-[var(--base-1-main)]">{props.amount}</span>
        </div>
        {isMobile ? null : (
          <Icon
            name="ic_arrow_right"
            color={iconColor}
            className="ml-1 w-5 h-5"
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={cx(
          'relative',
          'text-base mobile:text-lg font-semibold',
          'flex items-center',
          'justify-between',
          'h-9 mobile:h-11',
          'mb-2 mobile:mb-3 tablet:mb-2',
          'bg-linear-4',
          isMobile && props.isSupplierGame ? 'mb-0 h-7' : ''
        )}
      >
        <div className="flex items-center z-10">
          <div
            className={cx(
              'w-1 h-4 mobile:h-5 bgi-[var(--base-1-main)] rounded-full',
              'mr-1 mobile:mr-2 tablet:mr-3',
              props.lineClassName
            )}
          ></div>
          <div
            className={cx(
              'bgi-text-[var(--grayscale-90)]',
              'text-base mobile:text-lg font-semibold',
              'c-linear-2'
            )}
          >
            {renderI18N(props.title, t)}
          </div>
        </div>

        {/* 列表總數link */}
        {props.isShowAmount && (
          <BasePrimaryOutlineBtn
            className={cx(
              'w-auto h-auto',
              'text-sm mobile:text-base',
              'font-medium',
              'bgi-[var(--grayscale-00)]',
              'border border-[var(--grayscale-10)] rounded-lg',
              'hover:bgi-[var(--grayscale-00)] active:bgi-[var(--base-1-main)]'
            )}
            classNameBg={cx(
              'bgi-[var(--grayscale-00)] px-3 py-1 rounded-[6px] box-border'
            )}
            classNameText={cx(
              'bgi-text-[var(--grayscale-50)]',
              'hover:bgi-text-[var(--grayscale-40)]',
              'active:bgi-text-[var(--state-success-main)]'
            )}
            children={Amount()}
            onClick={props.onAmountClick}
          />
        )}

        {/* 滑動按鈕 */}
        {props.isShowSlideBtn &&
          (isMobile ? (
            <BasePrimaryBtn
              className={cx(
                'w-6 h-6 bgi-[var(--grayscale-00)] rounded-lg',
                'disabled:bgi-[var(--grayscale-00)] hover:bgi-[var(--grayscale-00)] active:bgi-[var(--grayscale-00)]'
              )}
              children={
                <Icon
                  name="ic_arrow_up_1"
                  color="var(--grayscale-50)"
                  className={cx(
                    'w-5 h-5',
                    props.isCollapse ? 'rotate-180' : '',
                    ''
                  )}
                />
              }
              onClick={props.toggleCollapse}
            />
          ) : (
            <div className="flex gap-1">
              <BasePrimaryBtn
                className={cx(slideBtnClass, 'rotate-180')}
                onClick={handleSlidePrev}
                disabled={isPrevBtnDisabled}
              >
                <Icon
                  className="w-5 h-5"
                  name="ic_arrow_right"
                  color={
                    isPrevBtnDisabled
                      ? 'var(--transparent-white-30)'
                      : 'var(--grayscale-100)'
                  }
                />
              </BasePrimaryBtn>
              <BasePrimaryBtn
                className={slideBtnClass}
                onClick={handleSlideNext}
                disabled={isNextBtnDisabled}
              >
                <Icon
                  className="w-5 h-5"
                  name="ic_arrow_right"
                  color={
                    isNextBtnDisabled
                      ? 'var(--transparent-white-30)'
                      : 'var(--grayscale-100)'
                  }
                />
              </BasePrimaryBtn>
            </div>
          ))}
      </div>

      {isMobile && props.isSupplierGame ? (
        <div className="h-[1px] my-2 bgi-[var(--grayscale-25)]"></div>
      ) : null}
    </>
  );
};

export default GameSectionHeader;
