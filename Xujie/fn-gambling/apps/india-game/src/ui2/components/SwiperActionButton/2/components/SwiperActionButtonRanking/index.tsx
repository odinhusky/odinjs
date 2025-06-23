import BaseCacheImg from '@libs/mode2/components/BaseCacheImg';
import { SWIPER_ACTION_BUTTON_SIZE_CLASS } from '../..';
import { EResourceLevel, getImgUrl } from '@libs/mode2/utils';
import { cx } from '@libs/commonUtils';
import handleGlobalClick from '@libs/mode2/action/handleGlobalClick';
import { handleSwiperActionButtonRankingClick } from '@libs/mode2/action/actionTypes';
import {
  RankingPageTabs,
  useRankingPageStore,
} from '@libs/mode2/zustand/page/RankingPage/rankingPageStore';
import { useNavPageClick } from '@libs/mode2/usecase/useNavPageClick';

export const SwiperActionButtonRanking = () => {
  const { navToRankingPage } = useNavPageClick();

  return (
    <button
      type="button"
      className={cx(SWIPER_ACTION_BUTTON_SIZE_CLASS)}
      onClick={() => {
        handleGlobalClick({
          target: handleSwiperActionButtonRankingClick,
          callback: () => {
            useRankingPageStore
              .getState()
              .setRankingPageTab(RankingPageTabs.MAIN);
            navToRankingPage('', { state: { tab: RankingPageTabs.MAIN } });
          },
        });
      }}
    >
      <BaseCacheImg
        src={getImgUrl(EResourceLevel.V, 'swiper_action_button_daily_free')}
        className={cx('w-full h-full')}
      />
    </button>
  );
};
