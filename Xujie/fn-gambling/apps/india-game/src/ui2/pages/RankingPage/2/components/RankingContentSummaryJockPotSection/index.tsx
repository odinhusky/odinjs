import {
  cx,
  useDeepEffect,
  useObserverElementMetrics,
} from '@libs/commonUtils';
import { FLEX_CENTER, X_CENTER } from '@libs/constant/style';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { useRankingPageStore } from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { RankingContentSummaryProps } from '../RankingContentSummary';
import { memo } from 'react';
import ShineEffectOfImage from '@mode2/components/ShineEffectOfImage';
import SpriteRankingCoinsSpray from '@components/SpriteRankingCoinsSpray';
import SpriteRankingAirplane from '@components/SpriteRankingAirplane';
import isEqual from 'lodash/isEqual';
import RankingContentSummaryJockPotNumbers from '../RankingContentSummaryJockPotNumbers';
import RankingContentSummaryJockPotBottomText from '../RankingContentSummaryJockPotBottomText';
import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';

export const RankingContentSummaryJockPotSection = memo(
  (props: RankingContentSummaryProps) => {
    const { styles, isModalMode } = props;

    const setJockPotElMetrics = useRankingPageStore(
      (state) => state.setJockPotElMetrics
    );

    const { elementRef: jockPotElRef, elementMetrics: jockPotElMetrics } =
      useObserverElementMetrics<HTMLDivElement>();

    useDeepEffect(() => {
      setJockPotElMetrics(jockPotElMetrics);
    }, [jockPotElMetrics]);

    return (
      <div
        ref={jockPotElRef}
        className={cx('w-full', 'absolute top-10 left-0 z-[1]')}
      >
        {/* 背景光 */}
        <div className={cx('absolute -top-12 z-[0]', X_CENTER)}>
          <BaseCacheImg
            src={getImgUrl(EResourceLevel.V, 'sprite_ranking_background_light')}
            alt="Light background image"
            className={cx('block', 'w-[314px]', 'animate-flicker-rotate')}
          />
        </div>

        {/* JACKPOT 區塊 480 *  */}

        <div className={cx('relative', 'mt-[6px]')}>
          <BaseCacheImg
            src={getImgUrl(EResourceLevel.V, 'jackpot_spray_coins')}
            alt="background image for spacing"
            className={cx('block', 'w-full', 'opacity-0')}
          />

          {/* JACKPOT Title */}
          <div className={cx('absolute top-0 z-[1]', X_CENTER)}>
            <div className={cx('overflow-hidden')}>
              <BaseCacheImg
                src={getImgUrl(EResourceLevel.V, 'jackpot_title_new')}
                alt="Jackpot title background image"
                className={cx('block', 'w-[237px]')}
              />
            </div>

            {/* 掃光效果層 */}
            <ShineEffectOfImage
              url={getImgUrl(EResourceLevel.V, 'jackpot_title_new')}
            />
          </div>

          {/* JACKPOT Stars */}
          <div
            className={cx('absolute -top-1 z-[0]', X_CENTER, {
              'w-[480px]': !isModalMode,
              'w-[336px]': isModalMode,
            })}
          >
            <BaseCacheImg
              src={getImgUrl(EResourceLevel.V, 'jackpot_star')}
              alt="Stars background image"
              className={cx('block', 'w-full', 'animate-star-pulse')}
            />
          </div>

          {/* JACKPOT coins mountain */}
          <div className={cx('absolute top-[20%] z-[2]', X_CENTER)}>
            <BaseCacheImg
              src={getImgUrl(EResourceLevel.V, 'jackpot_coins')}
              alt="Coins mountain image"
              className={cx('block', 'w-[263px]', 'animate-star-pulse')}
            />
          </div>

          {/* 金幣噴灑的 Sprite */}
          <div className={cx('absolute top-0 z-[2]', X_CENTER)}>
            <SpriteRankingCoinsSpray isModalMode={!!isModalMode} />
          </div>

          {/* 金額的板塊 */}
          <div className={cx('w-fit', 'absolute top-[28%] z-[4]', X_CENTER)}>
            <BaseCacheImg
              src={getImgUrl(EResourceLevel.V, 'jackpot_number_frame')}
              alt="Numbers background image"
              className={cx('block', 'w-[294px]')}
            />

            {/* 大雲 */}
            <div className={cx('w-fit', 'absolute top-7 -right-4 z-[1]')}>
              <BaseCacheImg
                src={getImgUrl(EResourceLevel.V, 'jackpot_cloud')}
                alt="Big cloud background image"
                className={cx('block', 'w-[46px]', 'animate-clound-bouncing')}
              />
            </div>

            {/* 小雲 */}
            <div className={cx('w-fit', 'absolute top-4 -right-6 z-[1]')}>
              <BaseCacheImg
                src={getImgUrl(EResourceLevel.V, 'jackpot_cloud')}
                alt="Big cloud background image"
                className={cx('block', 'w-[36px]', 'animate-clound-bouncing')}
                style={{ animationDelay: `${0.5}s` }}
              />
            </div>

            {/* 小飛機 */}
            <div className={cx('w-fit', 'absolute top-0 -left-16 z-[1]')}>
              <SpriteRankingAirplane isModalMode={isModalMode} />
            </div>

            {/* 滾動的數字 */}
            <div
              className={cx(
                'w-[70%]',
                FLEX_CENTER,
                'absolute top-[20%] phone:top-[23%] mobile:top-[25%] z-[2]',
                X_CENTER,
                styles?.JockPotSectionAnimateCounterBox
              )}
            >
              <RankingContentSummaryJockPotNumbers {...props} />
            </div>

            {/* 最下方的文字 */}
            <div
              className={cx(
                'absolute -bottom-6 z-[3]',
                X_CENTER,
                styles?.JockPotSectionText
              )}
            >
              <RankingContentSummaryJockPotBottomText
                isModalMode={isModalMode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
  (prev, next) => isEqual(prev, next)
);

export default RankingContentSummaryJockPotSection;
