import { POST_UPDATE_GENDER_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';

export type UpdateGenderRequest = {
  gender: string;
};

export const PostUpdateGenderEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<void, UpdateGenderRequest>({
    query: (reqData) => {
      return {
        method: 'post',
        url: POST_UPDATE_GENDER_URL,
        data: reqData,
      };
    },
  });
