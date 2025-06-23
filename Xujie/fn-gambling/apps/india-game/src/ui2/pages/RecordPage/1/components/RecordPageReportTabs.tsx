import cx from '@commonUtils/cx';
import { handleRecordPageReportTabClick } from '@mode2/action/actionTypes';
import useRecordPageActions from '@mode2/action/recordPageAction/useRecordPageActions';
import { useRecordPageBalanceReportStore } from '@mode2/zustand/page/recordPageStore';
import { useTranslation } from 'react-i18next';

export const RecordPageReportTabs = () => {
  const { t } = useTranslation();

  const reportTimeTabList = useRecordPageBalanceReportStore(
    (state) => state.reportTimeTabList
  );

  const activeReportTimeTabIndex = useRecordPageBalanceReportStore(
    (state) => state.activeReportTimeTabIndex
  );

  const { handleRecordPageClick } = useRecordPageActions();

  return (
    <div className="report-tabs !shadow-none !w-auto grid grid-cols-4 tablet:mx-0 mobile:-mx-5 -mx-4">
      {reportTimeTabList.map((tab, index) => {
        return (
          <button
            key={index}
            className={cx('report-tabs-btn', {
              'report-tabs-btn-select p-6': activeReportTimeTabIndex == index,
            })}
            onClick={() => {
              handleRecordPageClick({
                actionName: handleRecordPageReportTabClick,
                payload: { index },
              });
            }}
          >
            <div
              className={cx(
                'report-tabs-btn-txt',
                'text-sm mobile:text-base',
                'font-medium',
                {
                  'bgi-border-[var(--base-1-main)] after:border-x-0 after:border-t-0':
                    activeReportTimeTabIndex == index,
                }
              )}
            >
              {typeof tab === 'string' ? tab : t(tab.i18nKey, tab?.i18nOption)}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default RecordPageReportTabs;
