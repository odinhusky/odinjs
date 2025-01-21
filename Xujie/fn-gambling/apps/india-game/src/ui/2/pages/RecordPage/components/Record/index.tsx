import './index.scss';
import RecordPageSwitchRecordListTabs from '../RecordPageSwitchRecordListTabs';
import RecordPageRecordListTable from '../RecordPageRecordListTable';
import { cx } from '@libs/commonUtils';

const Record = () => {
  return (
    <>
      <div className={cx('mb-2 tablet:mb-5')}>
        <RecordPageSwitchRecordListTabs />
      </div>

      <RecordPageRecordListTable />
    </>
  );
};
export default Record;
