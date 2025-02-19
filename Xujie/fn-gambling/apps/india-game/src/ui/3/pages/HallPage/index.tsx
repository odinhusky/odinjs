import './index.scss';
import useMode2HallPageBase from '@/ui/hooks/pages/hallPage/useMode2HallPageBase';
import NoticeScroll from '@components/NoticeScroll';
import Banner from '@components/Banner';
import GameCategoryTabs from '@components/GameCategoryTabs';
import HallPageGameList from '@components/HallPageGameList/HallPageGameList';
import useHallPageHeaderSettingOverride from '@/ui/3/pages/HallPage/useHallPageHeaderSettingOverride';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';
import AffixHeaderBottomWrapper from '@libs/mode2/components/AffixHeaderBottomWrapper';
import HallPageUserInfo from '@components/HallPageUserInfo';

const HallPage = () => {
  useMode2HallPageBase();

  useHallPageHeaderSettingOverride();

  return (
    <div className={cx(FLEX_COL, 'gap-3')}>
      {/*{isDesktop && <ApkDownloadBanner />}*/}

      <Banner />

      <NoticeScroll />

      <HallPageUserInfo />

      <div className={cx('w-full flex gap-4', 'touch-pan-y')}>
        <AffixHeaderBottomWrapper isAllBpAffix={true}>
          <GameCategoryTabs />
        </AffixHeaderBottomWrapper>

        <HallPageGameList />
      </div>
    </div>
  );
};
export default HallPage;
