import { POST_WITHDRAW_CONFIG_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { extractApiMoneyString } from '@libs/commonUtils';

/**
 * 充值金額限制已經改由'/v1/api/pay/payConfigInfoWithOptions' endpoint中計算
 *
 * 因此此endpoint只提供提領限制相關資料
 */
export const enum LIMIT_TYPE {
  DEPOSIT = 1,
  WITHDRAW = 2,
}

type WithdrawConfigRequest = { type: LIMIT_TYPE };

/**
 * 單次可提領金額限制
 *
 * @param builder
 * @returns
 */
export const PostWithdrawConfigEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<WithdrawConfigResult, void>({
    query: () => {
      const reqData = {
        type: LIMIT_TYPE.WITHDRAW,
      } as WithdrawConfigRequest;

      return {
        method: 'post',
        url: POST_WITHDRAW_CONFIG_URL,
        data: {
          reqData,
        },
      };
    },

    transformResponse,
  });

export type WithdrawConfigResult = {
  minLimit: number;
  maxLimit: number;
};

const defaultResult = {
  minLimit: 0,
  maxLimit: 0,
};

const transformResponse = (
  response: ResponseStructure<string>
): WithdrawConfigResult => {
  const resp = response?.Body;
  if (resp) {
    const [minStr, maxStr] = resp.split('-');

    return {
      minLimit: extractApiMoneyString(minStr),
      maxLimit: extractApiMoneyString(maxStr),
    };
  }
  return defaultResult;
};
