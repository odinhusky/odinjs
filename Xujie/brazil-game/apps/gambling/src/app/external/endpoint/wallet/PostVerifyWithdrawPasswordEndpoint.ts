import { ExternelEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { POST_VERIFY_WITHDRAW_PASSWORD_URL } from '../../ApiUrl';

interface VerifyWithdrawPasswordRequest {
  withdrawPassword: string;
}

export const PostVerifyWithdrawPasswordEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<ResponseStructure<null>, VerifyWithdrawPasswordRequest>({
    query: (data: VerifyWithdrawPasswordRequest) => ({
      method: 'post',
      url: POST_VERIFY_WITHDRAW_PASSWORD_URL,
      data: data,
    }),
  });
