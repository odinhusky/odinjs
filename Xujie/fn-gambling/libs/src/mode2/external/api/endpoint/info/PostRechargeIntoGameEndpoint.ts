import { POST_RECHARGE_INTO_GAME_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * @example
 *
 * Success:
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Transfer successful! \"}"
 *
 * Failed:
 * "{\"Code\":500,\"Msg\":\"Request exception, you have exited the game! \",\"Body\":null}"
 * "{\"Code\":500,\"Msg\":\"Your balance is insufficient, it is possible that the recharge has not been received yet. Please try again later ! \",\"Body\":null}"
 */
type RechargeIntoGameResponse = string;

/** 確認遊戲內充值結果 */
export const PostRechargeIntoGameEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<RechargeIntoGameResult, void>({
    query: () => ({
      method: 'post',
      url: POST_RECHARGE_INTO_GAME_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type RechargeIntoGameResult = {
  isRechargeSuccess: boolean;
  rechargeResultMsg: string;
};

const transformResponse = (
  response: ResponseStructure<RechargeIntoGameResponse>
): RechargeIntoGameResult => {
  const isRechargeSuccess = response?.Code === 200;
  if (isRechargeSuccess) {
    return {
      isRechargeSuccess: true,
      rechargeResultMsg: response?.Body || '',
    };
  }
  return {
    isRechargeSuccess: false,
    rechargeResultMsg: response?.Msg || '',
  };
};
