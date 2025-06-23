import './index.scss';
import RecordPageSwitchRecordListTabs from '../RecordPageSwitchRecordListTabs';
import RecordPageRecordListTable from '../RecordPageRecordListTable';
import { cx } from '@libs/commonUtils';

const Record = () => {
  return (
    <>
      <div className={cx('mobile:mb-5 mb-3 tablet:mx-0 mobile:-mx-5 -mx-4')}>
        <RecordPageSwitchRecordListTabs />
      </div>

      <RecordPageRecordListTable />
    </>
  );
};
export default Record;
