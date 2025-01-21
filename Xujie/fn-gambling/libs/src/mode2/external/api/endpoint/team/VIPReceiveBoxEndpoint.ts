import { POST_VIP_RECEIVE_BOX_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * @example
 *
 * "{\"Code\":200,\"Msg\":\"\",\"Body\":\"Successful operation\"}"
 */
export type VIPReceiveBoxResponse = string;

/** 領取VIP升級獎勵 */
export const VIPReceiveBoxEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<VIPReceiveBoxResult, void>({
    query: () => ({
      method: 'post',
      url: POST_VIP_RECEIVE_BOX_URL,
      data: {
        reqData: {},
      },
    }),

    transformResponse,
  });

type VIPReceiveBoxResult = {
  isReceiveSuccess: boolean;
};

const transformResponse = (
  response: ResponseStructure<string>
): VIPReceiveBoxResult => {
  return {
    isReceiveSuccess: response?.Code === 200,
  };
};
