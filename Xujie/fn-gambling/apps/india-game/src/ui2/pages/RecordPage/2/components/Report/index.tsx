import './index.scss';
import RecordPageReportTabs from '../RecordPageReportTabs';
import RecordPageReportButtonsGroup from '../RecordPageReportButtonsGroup';
import BetBalanceReportProgress from '@components/BetBalanceReportProgress';

const Report = () => {
  return (
    <div className="report">
      <RecordPageReportTabs />

      <div className="tab-content">
        <BetBalanceReportProgress />

        <RecordPageReportButtonsGroup />
      </div>
    </div>
  );
};
export default Report;
