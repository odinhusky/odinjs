import { useBreakPoint } from '@libs/commonUtils';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import {
  RecordPageTabs,
  useRecordPageStore,
} from '@libs/mode2/zustand/page/recordPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useRecordPageHeaderSetting = () => {
  const thisPath = BasePagePathObj.RecordPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);
  const { isDesktop } = useBreakPoint();
  const tabIndex = useRecordPageStore((state) => state.tabIndex);

  const recordHeaderTitleText =
    tabIndex === RecordPageTabs.RECORD
      ? {
          i18nKey:
            'account_balance_record_fund_transfer_records_header_balance_record',
        }
      : { i18nKey: 'account_balance_report_header_balance_report' };

  useEffect(() => {
    if (location.pathname === thisPath) {
      if (isDesktop) {
        setConfig({
          type: EHeaderType.Main,
        });
      } else {
        setConfig({
          title: recordHeaderTitleText,
          type: EHeaderType.Common,
        });
      }
    }
  }, [isDesktop, recordHeaderTitleText]);
};

export default useRecordPageHeaderSetting;
