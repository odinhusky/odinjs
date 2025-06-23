import useRecordPageHeaderSettingOverride from './useRecordPageHeaderSettingOverride';
import {
  RecordPageHeaderTabs,
  useRecordPageHeaderTabsStore,
} from '@mode2/zustand/page/recordPageStore';
import { cx } from '@libs/commonUtils';
import Detail from './components/Detail';
import Withdrawal from './components/Withdrawal';
import { MOBILE_BREAK_POINT_MAX_WIDTH } from '@libs/constant/style';

export const RecordPage = () => {
  useRecordPageHeaderSettingOverride();

  const headerTabIndex = useRecordPageHeaderTabsStore(
    (state) => state.headerTabIndex
  );

  return (
    <div
      className={cx(
        MOBILE_BREAK_POINT_MAX_WIDTH,
        'w-screen -ml-4',
        'py-3 px-4'
      )}
    >
      {headerTabIndex === RecordPageHeaderTabs.DETAIL && <Detail />}
      {headerTabIndex === RecordPageHeaderTabs.WITHDRAWAL && <Withdrawal />}
    </div>
  );
};
export default RecordPage;
