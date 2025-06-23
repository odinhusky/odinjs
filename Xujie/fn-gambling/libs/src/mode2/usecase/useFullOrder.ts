import { useCallback, useEffect } from 'react';
import { useDeepEffect } from '@libs/commonUtils';
import {
  usePostRechargeUpdateReceiptMutation,
  usePostRechargeUploadReceiptMutation,
} from '@libs/mode2/external/api';
import { useMode2FullOrderDetailPageStore } from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import { useLoadingStore } from '@libs/mode2/zustand/components/loadingStore';
import { fileToBase64 } from '../utils';
import { useNavigateClick } from '@mode2/usecase/useNavPageClick';
import { useMessageStore } from '@mode2/zustand/components/messageStore';
import { useMode2OrderDetailPageStore } from '../zustand/page/orderDetailPageStore';
import { RechargeReceiptState } from '../external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import { useTranslation } from 'react-i18next';

export const useFullOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigateClick();
  const [
    postRechargeUploadReceipt,
    { data: uploadInfo, isLoading: isUploadLoading },
  ] = usePostRechargeUploadReceiptMutation();
  const [postRechargeUpdateReceipt, { data, isSuccess }] =
    usePostRechargeUpdateReceiptMutation();

  const setShowLoading = useLoadingStore((state) => state.setShowLoading);

  const orderId = useMode2FullOrderDetailPageStore((state) => state.orderId);
  const { confirmCode } = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );
  const setUploadDeatil = useMode2FullOrderDetailPageStore(
    (state) => state.setUploadDeatil
  );
  const setFullOrderFile = useMode2FullOrderDetailPageStore(
    (state) => state.setFullOrderFile
  );

  const orderDetail = useMode2OrderDetailPageStore(
    (state) => state.orderDetail
  );
  const setOrderDetail = useMode2OrderDetailPageStore(
    (state) => state.setOrderDetail
  );

  const orderList = useMode2OrderDetailPageStore((state) => state.orderList);
  const setOrderList = useMode2OrderDetailPageStore(
    (state) => state.setOrderList
  );

  useDeepEffect(() => {
    if (isSuccess && data) {
      useMessageStore.getState().success(data.result);
      // 更改訂單列表和訂單詳情的UTRState
      if ('UTRState' in orderDetail) {
        setOrderDetail({
          ...orderDetail,
          UTRState: RechargeReceiptState.PROCESSING,
        });
        const updatedOrderList = orderList.map((item) =>
          item.orderNumber === orderId
            ? {
                ...item,
                UTRState: RechargeReceiptState.PROCESSING,
              }
            : item
        );
        setOrderList(updatedOrderList);
      }

      setTimeout(() => {
        navigate(-1);
      }, 500);
    }
  }, [isSuccess, data]);

  const onUpdate = useCallback(() => {
    const trimConfirmCode = String(confirmCode ?? '').replace(/\s+/g, '');
    if (trimConfirmCode.length > 12) {
      useMessageStore.getState().info(t('confirm_code_too_long'));
      return false;
    }

    postRechargeUpdateReceipt({
      orderId: orderId,
      confirmCode: trimConfirmCode,
    });
    return;
  }, [confirmCode]);

  const onUpload = async (value: File) => {
    setShowLoading(true);
    const base64 = await fileToBase64(value);
    const obj = {
      fileBase64: base64,
      fileExtension: value.type,
      orderId: orderId,
    };

    setFullOrderFile(base64);
    postRechargeUploadReceipt(obj);
  };

  useEffect(() => {
    setShowLoading(isUploadLoading);
    if (uploadInfo) {
      setUploadDeatil(uploadInfo);
    }
  }, [isUploadLoading, uploadInfo]);

  return {
    onUpdate,
    onUpload,
  };
};
