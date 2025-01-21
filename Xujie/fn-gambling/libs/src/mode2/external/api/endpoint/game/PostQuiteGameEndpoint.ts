import { POST_GAME_QUITE_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export interface QuiteGameResponse {
  /* define response fields */
}

export const PostQuiteGameEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<ResponseStructure<QuiteGameResponse>, void>({
    query: () => ({
      method: 'post',
      url: POST_GAME_QUITE_URL,
      data: {
        reqData: {},
      },
    }),
  });
