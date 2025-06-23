import useMode2RecordPageBase from '@libs/mode2/usecase/page/recordPage/useMode2RecordPageBase';
import {
  useRecordPageStore,
  RecordPageTabs,
} from '@mode2/zustand/page/recordPageStore';
import RecordPageDesktopHeader from './components/RecordPageDesktopHeader';
import Record from './components/Record';
import Report from './components/Report';
import './index.scss';
import { cx } from '@libs/commonUtils';

export const RecordPage = () => {
  useMode2RecordPageBase();

  const tabIndex = useRecordPageStore((state) => state.tabIndex);

  return (
    <div className={cx('record', 'tablet:pt-5 pt-0')}>
      <div className={cx('tablet:mb-5')}>
        <RecordPageDesktopHeader />
      </div>

      {/* <div className={cx('w-full', 'mb-4 mobile:mb-5')}>
        <RecordPageSwitchTabs />
      </div> */}

      {tabIndex === RecordPageTabs.RECORD && <Record />}
      {tabIndex === RecordPageTabs.REPORT && <Report />}
    </div>
  );
};
export default RecordPage;
