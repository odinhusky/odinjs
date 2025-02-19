import {
  EOrderDetailPageType,
  IOrderDetailListType,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useEffect } from 'react';
import {
  usePostRechargeRecordsMutation,
  usePostWithdrawRecordsMutation,
} from '@libs/mode2/external/api';
import { useDeepEffect } from '@libs/commonUtils';
import { useRecordPageBalanceRecordStore } from '@libs/mode2/zustand/page/recordPageStore';
import { filterDataByDays } from '@libs/mode2/utils';

export const useModa2OrderDetailPageBaseInit = () => {
  const orderDetailPageType = useMode2OrderDetailPageStore(
    (state) => state.orderDetailPageType
  );
  const setOrderDetailList = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailList
  );

  const setRechargeRecords = useRecordPageBalanceRecordStore(
    (state) => state.setRechargeRecords
  );
  const setWthdrawRecords = useRecordPageBalanceRecordStore(
    (state) => state.setWthdrawRecords
  );

  const [triggerFetchRechargeRecord, { data: rechargeRecordData }] =
    usePostRechargeRecordsMutation();
  const [triggerFetchWithdrawRecord, { data: withdrawRecordData }] =
    usePostWithdrawRecordsMutation();

  useDeepEffect(() => {
    if (rechargeRecordData) {
      console.log(
        '@@@==> History recharge',
        rechargeRecordData.rechargeRecords[0]
      );
      const list = filterDataByDays(
        rechargeRecordData.rechargeRecords,
        1
      ) as unknown as IOrderDetailListType[];
      setOrderDetailList(list);

      setRechargeRecords(rechargeRecordData.rechargeRecords);
    }
  }, [rechargeRecordData]);

  useDeepEffect(() => {
    if (withdrawRecordData) {
      console.log(
        '@@@==> History withdraw',
        withdrawRecordData.withdrawRecords[0]
      );
      const list = filterDataByDays(
        withdrawRecordData.withdrawRecords,
        1
      ) as unknown as IOrderDetailListType[];
      setOrderDetailList(list);

      setWthdrawRecords(withdrawRecordData.withdrawRecords);
    }
  }, [withdrawRecordData]);

  // 已確認過充值紀錄和提現紀錄頁後端一次性回應1000條數據，暫時由前端進行1天、7天、30天的過濾
  useEffect(() => {
    console.log('@@@==> History  orderDetailPageType', orderDetailPageType);
    if (orderDetailPageType === EOrderDetailPageType.RECHARGE) {
      triggerFetchRechargeRecord({ page: 1, limit: 30 });
    } else if (orderDetailPageType === EOrderDetailPageType.WITHDRAW) {
      triggerFetchWithdrawRecord({ page: 1, limit: 30 });
    }
  }, [orderDetailPageType]);
};

export default useModa2OrderDetailPageBaseInit;
