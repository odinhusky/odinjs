import PageDeskTopHeader from '@components/PageDeskTopHeader';
import {
  useRecordPageStore,
  RecordPageTabs,
} from '@mode2/zustand/page/recordPageStore';

export const RecordPageDesktopHeader = () => {
  // const { handleRecordPageClick } = useRecordPageActions();
  // const onBack = useCallback(() => {
  //   handleRecordPageClick({
  //     actionName: handleRecordPageDesktopHeaderBackBtnClick,
  //   });
  // }, []);
  const tabIndex = useRecordPageStore((state) => state.tabIndex);

  return (
    <PageDeskTopHeader
      headerTitle={{
        i18nKey:
          tabIndex === RecordPageTabs.RECORD
            ? 'account_balance_record_fund_transfer_records_header_balance_record'
            : 'account_balance_report_header_balance_report',
      }}
    />
  );
};

export default RecordPageDesktopHeader;
