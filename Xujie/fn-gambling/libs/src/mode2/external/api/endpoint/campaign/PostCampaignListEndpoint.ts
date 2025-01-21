import { POST_CAMPAIGN_LIST_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
export type CampaignListResponse = Array<{
  displayEndTime?: string;
  displayStartTime?: string;
  endTime?: string;
  id?: number;
  imageUrlOnHomeCarousel?: string;
  imageUrlOnHomePopup?: string;
  showOnHomeCarousel?: boolean;
  showOnHomePopup?: boolean;
  startTime?: string;
  title?: string;
  type?: string;
}>;
/**
 * NOTICE 暂时没用 直接调用PostCampaignLaunchEndpoint
 * 可参与活动列表
 * */
export const PostCampaignListEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<CampaignListResponse, void>({
    query: () => ({
      method: 'post',
      url: POST_CAMPAIGN_LIST_URL,
    }),
    transformResponse,
  });

const transformResponse = (
  response: ResponseStructure<CampaignListResponse>
): CampaignListResponse => {
  return response.Body || [];
};
