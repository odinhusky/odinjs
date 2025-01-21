import './index.scss';
import RecordPageReportTabs from '../RecordPageReportTabs';
import RecordPageReportButtonsGroup from '../RecordPageReportButtonsGroup';
import RecordPageReportProgressGroup from '../RecordPageReportProgressGroup';

const Report = () => {
  return (
    <div className="report">
      <RecordPageReportTabs />

      <div className="tab-content">
        <RecordPageReportProgressGroup />

        <RecordPageReportButtonsGroup />
      </div>
    </div>
  );
};
export default Report;
