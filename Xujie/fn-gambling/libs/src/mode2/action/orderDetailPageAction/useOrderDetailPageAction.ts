import {
  EOrderDetailPageType,
  IOrderDetailListType,
  TOrderDetailTabUnitValue,
  useMode2OrderDetailPageStore,
} from '@libs/mode2/zustand/page/orderDetailPageStore';
import { ActionClickObjType } from '../common/actionClickObjetType';
import handleAction from '../common/handleAction';
import { HandleClickProps } from '../common/handleClickProps';
import handleGlobalClick from '../handleGlobalClick';
import { handleOrderDetailPageTabClick } from './actionType';
import { filterDataByDays } from '@libs/mode2/utils';
import { useRecordPageBalanceRecordStore } from '@libs/mode2/zustand/page/recordPageStore';

type ActionClickPayloadMap = {
  [handleOrderDetailPageTabClick]: { value: TOrderDetailTabUnitValue };
};

export interface HandleOrderDetailPageActionProps<
  T extends keyof ActionClickPayloadMap
> extends HandleClickProps<T, ActionClickPayloadMap> {}

export const useOrderDetailPageAction = () => {
  const orderDetailPageType = useMode2OrderDetailPageStore(
    (state) => state.orderDetailPageType
  );
  const setOrderDetailTabIndex = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailTabIndex
  );
  const setOrderDetailList = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetailList
  );
  const rechargeRecordList = useRecordPageBalanceRecordStore(
    (state) => state.rechargeRecordList
  );
  const withdrawRecordList = useRecordPageBalanceRecordStore(
    (state) => state.withdrawRecordList
  );

  const actionClickObj: ActionClickObjType<ActionClickPayloadMap> = {
    [handleOrderDetailPageTabClick]: ({ value }) => {
      handleGlobalClick({
        target: handleOrderDetailPageTabClick,
        callback: () => {
          setOrderDetailTabIndex(value);

          console.log('@@===> handleOrderDetailPageTabClick', value);

          const list =
            orderDetailPageType === EOrderDetailPageType.RECHARGE
              ? (filterDataByDays(
                  rechargeRecordList,
                  value
                ) as unknown as IOrderDetailListType[])
              : (filterDataByDays(
                  withdrawRecordList,
                  value
                ) as unknown as IOrderDetailListType[]);

          console.log('@@===> handleOrderDetailPageTabClick', value, list);
          setOrderDetailList(list);
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
