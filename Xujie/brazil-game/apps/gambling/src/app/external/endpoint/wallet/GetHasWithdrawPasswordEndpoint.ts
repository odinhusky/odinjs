import { ExternelEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { GET_HAS_WITHDRAW_PASSWORD_URL } from '../../ApiUrl';
import { BIND_WITHDRAW_PASSWORD } from '../../tags/WalletTags';
import { LOGIN, REGISTER } from '../../tags';

export const GetHasWithdrawPasswordEndpoint = (builder: ExternelEndpoint) =>
  builder.query<ResponseStructure<boolean | null>, null>({
    query: () => ({
      method: 'get',
      url: GET_HAS_WITHDRAW_PASSWORD_URL,
    }),
    providesTags: [BIND_WITHDRAW_PASSWORD, LOGIN, REGISTER],
  });

