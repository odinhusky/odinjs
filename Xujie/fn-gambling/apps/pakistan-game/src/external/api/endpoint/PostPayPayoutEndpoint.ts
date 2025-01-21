import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_PAYOUT_URL } from '@/external/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

// amount:100
// bankCardId:177
// password:"b59c67bf196a4758191e42f76670ceba"
export interface PayPayoutRequest {
  amount: number;
  bankCardId: number;
  password: string;
}

/**
 * 提領結果
 *
 * 充值時錢會先存在Lock assets
 * 但是可提領的錢只能從Total balance裡面提,會從Total balance提到Lock assets中
 *
 * <提現成功>
 *
 * {Code:200,Msg:"",Body:'Submitted successfully}
 *
 * <提現失敗>
 *
 * case 1: 密碼正確, 提領值為空或小於單次提領最小值
 *
 * {Code:400,Msg:"The withdrawal amount must be greater than or equal to 100!",Body:null}
 *
 * case 2: 提領金額格式正確, 密碼錯誤
 *
 * {Code:400,Msg:"Wrong withdrawal password!",Body:null}
 *
 * case 3: 超過單次提領上限
 *
 * {Code:400,Msg:"The withdrawal amount must be less than or equal to 50,000!",Body:null}
 *
 * case 4:
 * {Code:400,Msg:"Insufficient balance!",Body:null}
 *
 * case 5:
 *
 * {Code:400,Msg:"The bet amount does not meet the requirements!",Body:null}
 *
 * case 6: 提現金額已達當日可提領金額上限
 *
 */
type PayPayoutResponse = string; //

/** 錢包提領 */
export const PostPayPayoutEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<PayPayoutResult, PayPayoutRequest>({
    query: (data: PayPayoutRequest) => ({
      method: 'post',
      url: POST_PAY_PAYOUT_URL,
      data: data,
    }),

    transformResponse,
  });

type PayPayoutResult = {
  withdrawResult: string;
};

const defaultResult = {
  withdrawResult: '',
};

const transformResponse = (
  response: ResponseStructure<PayPayoutResponse>
): PayPayoutResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      withdrawResult: resp,
    };
  }
  return defaultResult;
};
