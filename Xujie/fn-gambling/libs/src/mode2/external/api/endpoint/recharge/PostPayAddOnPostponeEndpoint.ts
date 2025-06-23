import { ExternalEndpoint } from '@mode2API/types';
import { POST_PAY_ADDON_POSTPONE_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';

export const PostPayAddOnPostponeEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, void>({
    query: () => ({
      method: 'post',
      url: POST_PAY_ADDON_POSTPONE_URL,
      data: {},
    }),

    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): boolean => {
  return response.Code === 200;
};
