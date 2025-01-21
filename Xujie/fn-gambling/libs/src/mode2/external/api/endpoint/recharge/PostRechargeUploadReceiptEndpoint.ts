import { ExternalEndpoint } from '@mode2API/types';
import { POST_RECHARGE_UPLOAD_RECEIPT_URL } from '@mode2API/urls';
import { ResponseStructure } from '../ResponseStructure';

export type RechargeUploadReceiptRequest = {
  fileBase64: string; // 上傳的收據，轉Base64
  fileExtension: string; // 檔案類型
  orderId: string; // 訂單編號
};

interface RechargeUploadReceiptResponse {
  fileBase64?: string;
  fileExtension?: string;
  ocrConfirmCode?: string; // OCR回應的UTR code
}

export interface RechargeUploadReceiptResult {
  fileBase64?: string;
  fileExtension?: string;
  confirmCode?: string; // OCR回應的UTR code
}

/**
 * 充值订单上传收据附件
 * @param builder
 * @constructor
 */
export const PostRechargeUploadReceiptEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeUploadReceiptResult, RechargeUploadReceiptRequest>({
    query: (request) => {
      return {
        method: 'post',
        url: POST_RECHARGE_UPLOAD_RECEIPT_URL,
        data: { ...request },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<RechargeUploadReceiptResponse>
): RechargeUploadReceiptResult => {
  const resp = response?.Body;
  return {
    fileBase64: resp?.fileBase64 || '',
    fileExtension: resp?.fileExtension || '',
    confirmCode: resp?.ocrConfirmCode || '',
  };
};

export default PostRechargeUploadReceiptEndpoint;
