import { cx } from '@libs/commonUtils';
import RankingContentSummary from '../RankingContentSummary';
import RankingContentList from '../RankingContentList';
import RankingContentBottom from '../RankingContentBottom';
import useRankingContentBase from './useRankingContentBase';

export const RankingContent = () => {
  useRankingContentBase();

  return (
    <div className={cx('w-full', 'pb-[80px]')}>
      <RankingContentSummary />

      <RankingContentList />

      <RankingContentBottom />
    </div>
  );
};

export default RankingContent;
