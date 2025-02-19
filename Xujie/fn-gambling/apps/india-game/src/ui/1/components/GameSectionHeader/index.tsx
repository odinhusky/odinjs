import { useTranslation } from 'react-i18next';
import { Swiper as SwiperClass } from 'swiper/types';
import { cx } from '@libs/commonUtils';
import { I18NContent } from '@libs/mode2/@types/i18nType';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@components/Icon';
import { useEffect, useState } from 'react';
import { FLEX_CENTER } from '@libs/constant/style';
import BasePrimaryBtn from '@components/BasePrimaryBtn';

interface GameSectionHeaderProps {
  iconSrc: string;
  title: I18NContent;
  amount: number;
  isShowAmount: boolean;
  isShowSlideBtn: boolean;
  swiperRef?: React.RefObject<SwiperClass | null>;
  onAmountClick: () => void;
}

const GameSectionHeader = (props: GameSectionHeaderProps) => {
  const { t } = useTranslation();

  const slideBtnClass = cx(
    'w-6 h-6',
    'flex justify-center items-center',
    'rounded',
    'mobile:w-[23px] mobile:h-7',
    'bgi-[var(--grayscale-20)]',
    'disabled:bgi-[var(--transparent-gray-60)]',
    'hover:bgi-[var(--grayscale-15)]',
    'active:bgi-[var(--grayscale-00)]'
  );

  const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState(true);
  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);

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

  return (
    <div
      className={cx(
        'relative',
        'text-base mobile:text-lg font-semibold',
        FLEX_CENTER,
        'justify-between',
        'h-9 mobile:h-11',
        'mb-4',
        'box-border'
        // '-mx-4 mobile:-mx-5 tablet:mx-0'
      )}
    >
      {/* 文字內容 */}
      <div className={cx(FLEX_CENTER, 'z-10')}>
        <Icon
          className="w-6 h-6 mobile:w-7 mobile:h-7 tablet:w-9 tablet:h-9 mr-1"
          name={props.iconSrc}
        />
        <div
          className={cx(
            'bgi-text-[var(--grayscale-100)]',
            'text-base mobile:text-lg font-semibold',
            'c-linear-2'
          )}
        >
          {renderI18N(props.title, t)}
        </div>
      </div>

      {/* 列表總數link */}
      {props.isShowAmount && (
        <BasePrimaryBtn
          className={cx(
            'w-[63px] h-[28px]',
            'w-[86px] h-[32px]',
            'rounded',
            'text-sm mobile:text-base'
          )}
          classNameText={cx(
            'font-medium text-white',
            'text-sm mobile:text-base'
          )}
          onClick={props.onAmountClick}
          children={t('home_btn_all', { amount: props.amount })}
        />
      )}

      {/* 滑動按鈕 */}
      {props.isShowSlideBtn && (
        <div className="flex gap-1">
          <button
            type="button"
            className={slideBtnClass}
            onClick={handleSlidePrev}
            disabled={isPrevBtnDisabled}
          >
            <Icon
              className="w-5 h-5"
              name="ic_arrow_left_1"
              color={
                isPrevBtnDisabled
                  ? 'var(--transparent-white-30)'
                  : 'var(--grayscale-100)'
              }
            />
          </button>
          <button
            type="button"
            className={slideBtnClass}
            onClick={handleSlideNext}
            disabled={isNextBtnDisabled}
          >
            <Icon
              className="w-5 h-5"
              name="ic_arrow_right_1"
              color={
                isNextBtnDisabled
                  ? 'var(--transparent-white-30)'
                  : 'var(--grayscale-100)'
              }
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default GameSectionHeader;
