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

export const useFullOrder = () => {
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

  useDeepEffect(() => {
    if (isSuccess && data) {
      useMessageStore.getState().success(data.result);

      setTimeout(() => {
        navigate(-1);
      }, 500);
    }
  }, [isSuccess, data]);

  const onUpdate = useCallback(() => {
    postRechargeUpdateReceipt({
      orderId: orderId,
      confirmCode: confirmCode,
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
