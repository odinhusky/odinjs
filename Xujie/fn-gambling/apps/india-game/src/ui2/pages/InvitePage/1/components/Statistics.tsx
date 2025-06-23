import '../index.scss';
import StaticsHeader from './StaticsHeader';
import StaticsInviteBtn from './StaticsInviteBtn';
import StaticsUnlimitedDevelopmentDiagram from './StaticsUnlimitedDevelopmentDiagram';
import StaticsSpecialDetail from './StaticsSpecialDetail';
import StaticsQAList from './StaticsQAList';
import { cx } from '@libs/commonUtils';
import { FLEX_COL } from '@libs/constant/style';

export const Statistics = () => {
  return (
    <div
      className={cx('statistics', FLEX_COL, 'gap-3 mobile:gap-5', 'text-base')}
    >
      <div className="flex flex-col mobile:gap-5 gap-0">
        <StaticsHeader />
        <StaticsInviteBtn className="tablet:!hidden block" />
      </div>

      <StaticsUnlimitedDevelopmentDiagram />

      <StaticsInviteBtn />

      <StaticsSpecialDetail />

      <StaticsInviteBtn />

      <StaticsQAList />
    </div>
  );
};
