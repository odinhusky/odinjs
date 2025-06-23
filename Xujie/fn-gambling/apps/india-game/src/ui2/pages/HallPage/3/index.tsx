import './index.scss';
import useMode2HallPageBase from '@/ui/hooks/pages/hallPage/useMode2HallPageBase';
import NoticeScroll from '@components/NoticeScroll';
import Banner from '@components/Banner';
import GameCategoryTabs from '@components/GameCategoryTabs';
import HallPageGameList from '@components/HallPageGameList';
import useHallPageHeaderSettingOverride from './useHallPageHeaderSettingOverride';
import { cx } from '@libs/commonUtils';
import { FLEX_CENTER, FLEX_COL } from '@libs/constant/style';
import AffixHeaderBottomWrapper from '@libs/mode2/components/AffixHeaderBottomWrapper';
import HallPageUserInfo from '@components/HallPageUserInfo';
import sdkUtils from '@libs/mode2/utils/sdk';
import useHallPageGameCategoryTabsInit from './useHallPageGameCategoryTabsInit';
import SearchGameButton from '@components/SearchGameButton';
import { useMemo } from 'react';
import { useMode2HallPageStore } from '@libs/mode2/zustand/page/hallPageStore';

export const HallPage = () => {
  useMode2HallPageBase();

  useHallPageHeaderSettingOverride();

  useHallPageGameCategoryTabsInit();

  const setIsHallPageAffixed = useMode2HallPageStore(
    (state) => state.setIsHallPageAffixed
  );

  const tabList = useMemo(() => {
    return (
      <>
        <SearchGameButton
          className={cx(
            'w-[4.5rem] h-[3.25rem]',
            'p-1',
            'rounded-lg border',
            'bgi-border-[var(--transparent-white-20)]',
            'mb-2'
          )}
        />
        <GameCategoryTabs />
      </>
    );
  }, []);

  return (
    <div className={cx(FLEX_COL, 'gap-3')}>
      <Banner bannerSwipeDuration={4000} />

      {/* eslint-disable-next-line react/jsx-no-undef */}

      <NoticeScroll fromPropsFontColor={'var(--grayscale-100)'} />

      <HallPageUserInfo />

      <div className={cx('w-full flex gap-4', 'touch-pan-y')}>
        <AffixHeaderBottomWrapper
          isAllBpAffix={true}
          onChange={(isAffixed) => {
            setIsHallPageAffixed(!!isAffixed);
          }}
        >
          {tabList}
        </AffixHeaderBottomWrapper>

        <HallPageGameList />
      </div>

      <div
        className={cx(
          '!h-4',
          FLEX_CENTER,
          '!text-xs !bgi-text-[var(--base-2-variant2)]'
        )}
      >
        version {sdkUtils.getH5VersionName()}
      </div>
    </div>
  );
};
export default HallPage;
