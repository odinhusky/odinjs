import './index.scss';

import useMode2HallPageBase from '@/ui/hooks/pages/hallPage/useMode2HallPageBase';

import { NoticeScroll } from '@components/NoticeScroll';
import GameCategoryTabs from '@components/GameCategoryTabs';
import HallPageGameList from '@components/HallPageGameList/HallPageGameList';
import ApkDownloadBanner from '@components/ApkDownloadBanner';
import { useBreakPoint } from '@libs/commonUtils';
import Banner from '@components/Banner';

const HallPage = () => {
  const { isDesktop } = useBreakPoint();
  useMode2HallPageBase();

  return (
    <div className={'mt-2 mobile:mt-5 tablet:mt-8'}>
      {isDesktop && <ApkDownloadBanner />}

      <Banner />

      <NoticeScroll />

      <GameCategoryTabs />

      <HallPageGameList />
    </div>
  );
};
export default HallPage;
