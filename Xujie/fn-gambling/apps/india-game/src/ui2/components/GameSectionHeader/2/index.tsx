import { useTranslation } from 'react-i18next';
import { cx } from '@libs/commonUtils';
import { EResourceLevel, getImgUrl } from '@mode2/utils';
import renderI18N from '@libs/commonUtils/renderI18N';
import Icon from '@components/Icon';
import { useEffect, useState } from 'react';
import BasePrimaryBtn from '@components/BasePrimaryBtn';
import { GameSectionHeaderProps } from '../GameSectionHeaderProps';

const GameSectionHeader = (props: GameSectionHeaderProps) => {
  const { t } = useTranslation();

  const slideBtnClass =
    'w-5 h-6 flex justify-center items-center rounded mobile:w-[23px] mobile:h-7 bgi-[var(--grayscale-20)] disabled:bgi-[var(--transparent-gray-60)] hover:bgi-[var(--grayscale-15)] active:bgi-[var(--grayscale-00)]';

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
        'bgi-[var(--linear-4)] relative',
        'text-base mobile:text-lg font-semibold',
        'flex items-center',
        'justify-between',
        'h-9 mobile:h-11',
        'px-4 mb-4',
        'box-border',
        'bg-linear-4',
        '-mx-4 mobile:-mx-5 tablet:mx-0'
      )}
    >
      {/* 背景圖 */}
      <img
        className={
          'absolute h-9 mobile:h-11 w-auto backdrop-opacity-50 object-cover left-0'
        }
        src={getImgUrl(EResourceLevel.V, 'home_game_title_2')}
        alt="home_game_title_2"
      />
      <img
        className={'absolute h-9 mobile:h-11 w-auto object-cover left-0'}
        src={getImgUrl(EResourceLevel.V, 'home_game_title_1')}
        alt="home_game_title_1"
      />

      <div className="flex items-center z-10">
        <Icon
          className="w-6 h-6 mobile:w-7 mobile:h-7 tablet:w-9 tablet:h-9 mr-1"
          name={props.iconSrc}
          color="var(--base-2-main)"
        />
        <div
          className={cx(
            'bgi-text-[var(--linear-2)]',
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
            'w-auto h-auto',
            'text-sm mobile:text-base',
            'px-4 py-1',
            'font-medium',
            'bg-base-1-main'
          )}
          children={t('home_btn_all', { amount: props.amount })}
          onClick={props.onAmountClick}
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
              name={isPrevBtnDisabled ? `ic_arrow_left_3` : `ic_arrow_left`}
              className="w-5 h-5"
            />
          </button>
          <button
            type="button"
            className={slideBtnClass}
            onClick={handleSlideNext}
            disabled={isNextBtnDisabled}
          >
            <Icon
              name={isNextBtnDisabled ? `ic_arrow_right_3` : `ic_arrow_right`}
              className="w-5 h-5"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default GameSectionHeader;
