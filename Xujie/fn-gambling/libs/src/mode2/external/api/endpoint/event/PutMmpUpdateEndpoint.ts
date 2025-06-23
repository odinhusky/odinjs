import { ExternalEndpoint } from '@mode2API/types';
import sdkUtils from '@mode2/utils/sdk';
import { PUT_MMP_UPDATE_URL } from '@mode2API/urls';
import isEmpty from 'lodash/isEmpty';

export const PutMmpUpdateEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, void>({
    query: () => {
      const setting = sdkUtils.getDeepLinkAppSetting();
      const data = {
        fbc: setting?.fbc || '',
        fbp: setting?.fbp || '',
        mmpParameter: {
          adId: setting?.adId || '',
          adName: setting?.adName || '',
          adSetId: setting?.adsetId || '',
          adSetName: setting?.adsetName || '',
          campaignId: setting?.campaignId || '',
          campaignName: setting?.campaignName || '',
          placement: setting?.placement || '',
          siteSourceName: setting?.siteSourceName || '',
        },
      };
      return {
        method: 'put',
        url: PUT_MMP_UPDATE_URL,
        data: data,
      };
    },
    transformResponse,
  });

const transformResponse = (response: string): boolean => {
  const resp = response;
  return !isEmpty(resp);
};
