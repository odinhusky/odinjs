import { SubordinateSearch } from './components/SubordinateSearch';
import { SubordinateLevel } from './components/SubordinateLevel';
import { SubordinateTurnover } from './components/SubordinateTurnover';
import { DetailList } from './components/DetailList';
import useMode2SubordinateDataPageBase from '@mode2/usecase/page/SubordinateDataPage/useMode2SubordinateDataPageBase';
import TeamClubLevelSummary from './components/TotalSummary';
import { cx } from '@libs/commonUtils';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

const SubordinateDataPage = () => {
  useMode2SubordinateDataPageBase();

  return (
    <div
      className={cx(MOBILE_BREAK_POINT_MAX_WIDTH, 'py-4 gap-3 flex flex-col')}
    >
      <TeamClubLevelSummary />
      <SubordinateTurnover />
      <SubordinateLevel />
      <SubordinateSearch />
      <DetailList />
    </div>
  );
};

export default SubordinateDataPage;
