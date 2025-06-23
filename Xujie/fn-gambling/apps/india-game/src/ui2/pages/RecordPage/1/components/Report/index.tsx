import './index.scss';
import RecordPageReportTabs from '../RecordPageReportTabs';
import RecordPageReportButtonsGroup from '../RecordPageReportButtonsGroup';
import RecordPageReportProgressGroup from '@components/BetBalanceReportProgress';

const Report = () => {
  return (
    <div className="report tablet:mb-16 mb-0">
      <RecordPageReportTabs />

      <div
        className="tab-content
            tablet:mt-0 mobile:mt-5 mt-3
            tablet:!p-6 mobile:!py-3 mobile:!px-6 !py-4 !px-5"
      >
        <RecordPageReportProgressGroup />

        <RecordPageReportButtonsGroup />
      </div>
    </div>
  );
};
export default Report;
