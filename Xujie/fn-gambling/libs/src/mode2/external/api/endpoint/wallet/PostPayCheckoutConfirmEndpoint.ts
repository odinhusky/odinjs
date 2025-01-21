import { POST_PAY_CHECKOUT_CONFIRM_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
export type PayCheckoutConfirmRequest = {
  confirmCode: string; // UTR oced
  orderId: string; // [v2/api/pay/checkout-detail] rep {orderId}
};
type PayCheckoutConfirmResult = null;
export const PostPayCheckoutConfirmEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayCheckoutConfirmResult, PayCheckoutConfirmRequest>({
    query: (reqData) => ({
      method: 'post',
      url: POST_PAY_CHECKOUT_CONFIRM_URL,
      data: {
        reqData,
      },
    }),
  });
