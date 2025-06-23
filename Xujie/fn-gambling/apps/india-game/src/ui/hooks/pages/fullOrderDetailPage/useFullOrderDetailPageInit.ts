import { usePostRechargeQueryReceiptMutation } from '@libs/mode2/external/api';
// import { RechargeReceiptState } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeQueryReceiptEndpoint';
import { RechargeUploadReceiptResult } from '@libs/mode2/external/api/endpoint/recharge/PostRechargeUploadReceiptEndpoint';
import { base64ToFile, fileToBase64, getParams } from '@libs/mode2/utils';
import { useLoadingStore } from '@libs/mode2/zustand/components/loadingStore';
import {
  initDefaultValues,
  useMode2FullOrderDetailPageStore,
} from '@libs/mode2/zustand/page/fullOrderDetailPageStore';
import { useMode2OrderDetailPageStore } from '@libs/mode2/zustand/page/orderDetailPageStore';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useFullOrderDetailPageInit = () => {
  const location = useLocation();

  const [postRechargeQueryReceipt, { data: queryReceipt, isLoading }] =
    usePostRechargeQueryReceiptMutation();

  const setorderId = useMode2FullOrderDetailPageStore(
    (state) => state.setorderId
  );
  const defaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.defaultValues
  );
  const setDefaultValues = useMode2FullOrderDetailPageStore(
    (state) => state.setDefaultValues
  );
  const setFullOrderFile = useMode2FullOrderDetailPageStore(
    (state) => state.setFullOrderFile
  );
  const setUploadDeatil = useMode2FullOrderDetailPageStore(
    (state) => state.setUploadDeatil
  );
  const setRechargeQueryReceiptResult = useMode2FullOrderDetailPageStore(
    (state) => state.setRechargeQueryReceiptResult
  );
  const setShowLoading = useLoadingStore((state) => state.setShowLoading);
  const orderDetail = useMode2OrderDetailPageStore(
    (state) => state.orderDetail
  );
  // const setOrderDetail = useMode2OrderDetailPageStore(
  //   (state) => state.setOrderDetail
  // );
  // const orderList = useMode2OrderDetailPageStore((state) => state.orderList);
  // const setOrderList = useMode2OrderDetailPageStore(
  //   (state) => state.setOrderList
  // );

  const params = getParams(['orderId'], location.search, location.state);

  useEffect(() => {
    const fetchData = async () => {
      setShowLoading(isLoading);
      if (queryReceipt) {
        console.log('@@@===> queryReceipt', queryReceipt);
        const decodedFile = base64ToFile(
          queryReceipt.receiptFileBase64
        ) as File;
        const str = await fileToBase64(decodedFile!);
        setDefaultValues(queryReceipt);
        setFullOrderFile(str);
        setRechargeQueryReceiptResult(queryReceipt);
      }
    };
    fetchData();
  }, [queryReceipt, isLoading]);

  const uploadDeatil = useMode2FullOrderDetailPageStore(
    (state) => state.uploadDeatil
  );

  useEffect(() => {
    if (uploadDeatil.confirmCode) {
      if (!defaultValues.confirmCode || defaultValues.confirmCode.length < 12) {
        setDefaultValues({
          ...defaultValues,
          confirmCode: uploadDeatil.confirmCode,
        });
      }
    }
  }, [uploadDeatil]);

  const reset = () => {
    setFullOrderFile('');
    setDefaultValues(initDefaultValues);
    setUploadDeatil({} as RechargeUploadReceiptResult);
  };

  useEffect(() => {
    const orderId = params.orderId as string;
    setorderId(orderId);
    postRechargeQueryReceipt({
      orderId,
    });

    // 更改訂單列表和訂單詳情的UTRState
    if ('UTRState' in orderDetail) {
      console.log('orderDetail');
    }

    return () => reset();
  }, []);
};
export default useFullOrderDetailPageInit;
