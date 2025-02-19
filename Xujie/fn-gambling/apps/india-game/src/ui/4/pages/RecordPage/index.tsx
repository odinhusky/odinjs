import useRecordPageHeaderSettingOverride from '@/ui/4/pages/RecordPage/useRecordPageHeaderSettingOverride';
import {
  RecordPageHeaderTabs,
  useRecordPageHeaderTabsStore,
} from '@mode2/zustand/page/recordPageStore';
import { cx } from '@libs/commonUtils';
import Detail from './components/Detail';
import Withdrawal from './components/Withdrawal';

// TODO Ronan Deatil 需後端補充資料. Withdraw可以先做
// TODO Detail 先留空
const RecordPage = () => {
  // Detail頁應該是新的api，withdraw的api暫時寫在headerOverride裡
  // useMode2RecordPageBase();

  useRecordPageHeaderSettingOverride();

  const headerTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.headerTabIndex
  );

  return (
    <div className={cx('record', 'py-3')}>
      {headerTabIndex === RecordPageHeaderTabs.DETAIL && <Detail />}
      {headerTabIndex === RecordPageHeaderTabs.WITHDRAWAL && <Withdrawal />}
    </div>
  );
};
export default RecordPage;
