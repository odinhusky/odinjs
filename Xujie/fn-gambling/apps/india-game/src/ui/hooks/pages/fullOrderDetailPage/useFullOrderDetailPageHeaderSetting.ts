import { RechargeReceiptState } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import {
  EHeaderType,
  useHeaderStore,
} from '@libs/mode2/zustand/components/headerStore';
import { useMode2FullOrderDetailPageStore } from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import useLeaveModalStore from '@libs/mode2/zustand/components/leaveModalStore';
import { useEffect } from 'react';
import { useNavigateClick } from '@libs/mode2/usecase/useNavPageClick';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';
import { useLocation } from 'react-router';

const useFullOrderDetailPageHeaderSetting = () => {
  const navigate = useNavigateClick();

  const thisPath = BasePagePathObj.FullOrderDetailPage;
  const location = useLocation();
  const setConfig = useHeaderStore((state) => state.setConfig);

  const { setIsShowleaveModal } = useLeaveModalStore();

  const { state, confirmCode } = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );

  useEffect(() => {
    if (location.pathname === thisPath) {
      setConfig({
        type: EHeaderType.Common,
        title: { i18nKey: 'balance_record_deposit_record_receipt_page_title' },
        onBack: () => {
          if (state === RechargeReceiptState.UNCOMPLETED && confirmCode) {
            setIsShowleaveModal(true);
          } else {
            navigate(-1);
          }
        },
      });
    }
  }, [state, confirmCode]);
};
export default useFullOrderDetailPageHeaderSetting;
