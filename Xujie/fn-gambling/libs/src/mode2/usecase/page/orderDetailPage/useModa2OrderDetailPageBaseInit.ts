import {
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
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';

export const useModa2OrderDetailPageBaseInit = () => {
  // orderDetailPageType 应该用不到了 改为 curSwitchContentTabId
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );
  const orderListTabIndex = useMode2OrderDetailPageStore(
    (state) => state.orderListTabIndex
  );
  const setOrderList = useMode2OrderDetailPageStore(
    (state) => state.setOrderList
  );

  const setRechargeRecords = useRecordPageBalanceRecordStore(
    (state) => state.setRechargeRecords
  );
  const setWthdrawRecords = useRecordPageBalanceRecordStore(
    (state) => state.setWthdrawRecords
  );

  const [postRechargeRecords, { data: rechargeRecordData }] =
    usePostRechargeRecordsMutation();
  const [postWithdrawRecords, { data: withdrawRecordData }] =
    usePostWithdrawRecordsMutation();

  useDeepEffect(() => {
    if (rechargeRecordData) {
      const list = filterDataByDays(
        rechargeRecordData.rechargeRecords,
        orderListTabIndex || 1
      ) as unknown as IOrderDetailListType[];
      setOrderList(list);

      setRechargeRecords(rechargeRecordData.rechargeRecords);
    }
  }, [rechargeRecordData, orderListTabIndex]);

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
      setOrderList(list);

      setWthdrawRecords(withdrawRecordData.withdrawRecords);
    }
  }, [withdrawRecordData]);

  // 已確認過充值紀錄和提現紀錄頁後端一次性回應1000條數據，暫時由前端進行1天、7天、30天的過濾
  useEffect(() => {
    console.log('@@@==> History curSwitchContentTabId', curSwitchContentTabId);
    if (curSwitchContentTabId === WalletPageTabType.DEPOSIT) {
      postRechargeRecords({ page: 1, limit: 1000 });
    } else if (curSwitchContentTabId === WalletPageTabType.WITHDRAW) {
      postWithdrawRecords({ page: 1, limit: 30 });
    }
  }, [curSwitchContentTabId]);
};

export default useModa2OrderDetailPageBaseInit;
