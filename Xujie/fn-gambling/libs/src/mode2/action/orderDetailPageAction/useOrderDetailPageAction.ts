import {
  IOrderDetailListType,
  TOrderDetailTabUnitValue,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import {
  handleOrderDetailPageShowModal,
  handleOrderDetailPageTabClick,
} from '@mode2/action/actionTypes';
import { filterDataByDays } from '@libs/mode2/utils';
import { useRecordPageBalanceRecordStore } from '@libs/mode2/zustand/page/recordPageStore';
import { WalletPageTabType } from '@libs/mode2/@types/walletPageTabType';
import { useWalletPageSwitchContentTabsStore } from '@libs/mode2/zustand/page/WalletPage/walletPageSwitchContentTabsStore';
import { useRouterPenddingDataStore } from '@libs/mode2/zustand/routerPenddingDataStore';
import { BasePagePathObj } from '@libs/mode2/routerTypes/types';

type ActionClickPayloadMap = {
  [handleOrderDetailPageTabClick]: { value: TOrderDetailTabUnitValue };
  [handleOrderDetailPageShowModal]: { orderId: string; detail: string };
};

export interface HandleOrderDetailPageActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useOrderDetailPageAction = () => {
  const curSwitchContentTabId = useWalletPageSwitchContentTabsStore(
    (state) => state.curSwitchContentTabId
  );

  const setOrderListTabIndex = useMode2OrderDetailPageStore(
    (state) => state.setOrderListTabIndex
  );
  const setOrderList = useMode2OrderDetailPageStore(
    (state) => state.setOrderList
  );
  const setCurrentOrderId = useMode2OrderDetailPageStore(
    (state) => state.setCurrentOrderId
  );
  const setShowOrderDetailModal = useMode2OrderDetailPageStore(
    (state) => state.setShowOrderDetailModal
  );
  const setOrderDetail = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetail
  );
  const rechargeRecordList = useRecordPageBalanceRecordStore(
    (state) => state.rechargeRecordList
  );
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );
  const setRouterPenddingData = useRouterPenddingDataStore(
    (state) => state.setRouterPenddingData
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleOrderDetailPageTabClick]: ({ value }) => {
      handleGlobalClick({
        target: handleOrderDetailPageTabClick,
        payload: { value },
        callback: () => {
          setOrderListTabIndex(value);

          const list =
            curSwitchContentTabId === WalletPageTabType.DEPOSIT
              ? (filterDataByDays(
                  rechargeRecordList,
                  value
                ) as unknown as IOrderDetailListType[])
              : (filterDataByDays(
                  withdrawRecordList,
                  value
                ) as unknown as IOrderDetailListType[]);

          setOrderList(list);

          setRouterPenddingData(BasePagePathObj.OrderDetailPage, {
            tab: value.toString(),
          });
        },
      });
    },
    [handleOrderDetailPageShowModal]: ({ orderId, detail }) => {
      handleGlobalClick({
        target: handleOrderDetailPageShowModal,
        payload: { orderId, detail },
        callback: () => {
          try {
            const obj = JSON.parse(decodeURIComponent(detail));
            setOrderDetail(obj);
          } catch (error) {
            console.log(error);
          }
          setCurrentOrderId(orderId);
          setShowOrderDetailModal(true);
        },
      });
    },
  };

  const handleOrderDetailPageClick = <T extends keyof ActionClickPayloadMap>({
    actionName,
    payload,
  }: HandleOrderDetailPageActionProps<T>) => {
    handleAction({
      actionName,
      payload,
      actionClickObj,
    });
  };

  return {
    actionClickObj,
    handleOrderDetailPageClick,
  };
};

export default useOrderDetailPageAction;
