import { ExternalEndpoint } from '@mode2API/types';
import { POST_EVENT_ADJUST_PATCH_URL } from '@mode2API/urls';
import isEmpty from 'lodash/isEmpty';

export const PostEventAdjustPatchEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, void>({
    query: () => {
      return {
        method: 'post',
        url: POST_EVENT_ADJUST_PATCH_URL,
        data: {},
      };
    },
    transformResponse,
  });

const transformResponse = (response: string): boolean => {
  console.log('@@@===> postPixelEvent, response', response);
  const resp = response;
  return !isEmpty(resp);
};
