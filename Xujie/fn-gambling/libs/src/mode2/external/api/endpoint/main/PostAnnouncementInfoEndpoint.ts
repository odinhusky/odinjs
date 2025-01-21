import { POST_ANNOUNCEMENT_INFO_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import {
  AnnouncementOriginalData,
  ParsingAnnouncementResult,
  useParsingAnnouncementsContent,
} from '@mode2/usecase/announcement/useParsingAnnouncementsContent';
import { AnnouncementScenariosType } from '@mode2/usecase/announcement/useAnnouncementActionBase';

interface AnnouncementInfoResponseItem extends AnnouncementOriginalData {
  Type?: number;
  Content?: string;
  Image?: string;

  // unused
  Title?: string;
  DetailImg?: string;
  CreateTime?: number;
  IsMySelfShow?: number;
  IsSidebarShow?: number;
}

type AnnouncementInfoResponse = AnnouncementInfoResponseItem[];

/** 活動頁面資訊 */
export const PostAnnouncementInfoEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<AnnouncementInfoResult, void>({
    query: () => ({
      method: 'post',
      url: POST_ANNOUNCEMENT_INFO_URL,
      data: {
        reqData: {},
      },
    }),
    transformResponse,
  });

export interface AnnouncementResult extends ParsingAnnouncementResult {
  imageSrc: string;
}

export type AnnouncementInfoResult = AnnouncementResult[];

const defaultResult: AnnouncementResult[] = [];

const transformResponse = (
  response: ResponseStructure<AnnouncementInfoResponse>
): AnnouncementInfoResult => {
  const resp = response?.Body;
  if (resp) {
    return useParsingAnnouncementsContent(
      AnnouncementScenariosType.ACTIVITY,
      resp
    ).map((item) => ({
      ...item,
      imageSrc: item.bannerUrl,
    }));
  }
  return defaultResult;
};
