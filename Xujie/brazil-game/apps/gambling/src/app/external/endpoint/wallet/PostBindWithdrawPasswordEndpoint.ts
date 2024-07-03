import { ExternelEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { POST_BIND_WITHDRAW_PASSWORD_URL } from '../../ApiUrl';
import { BIND_WITHDRAW_PASSWORD } from '../../tags/WalletTags';

interface BindWithdrawPasswordRequest {
  withdrawPassword: string;
}

export const PostBindWithdrawPasswordEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<ResponseStructure<null>, BindWithdrawPasswordRequest>({
    query: (data: BindWithdrawPasswordRequest) => ({
      method: 'post',
      url: POST_BIND_WITHDRAW_PASSWORD_URL,
      data: data,
    }),
    invalidatesTags: [BIND_WITHDRAW_PASSWORD],
  });
