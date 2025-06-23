import { POST_ANNOUNCEMENT_INFO_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import {
  AnnouncementOriginalData,
  ParsingAnnouncementResult,
  useAnnouncementsParameterCheckAndSortOrderId,
  useParsingAnnouncementsContent,
} from '@mode2/usecase/announcement/useParsingAnnouncementsContent';
import { AnnouncementScenariosType } from '@mode2/usecase/announcement/useAnnouncementActionBase';
import { AnnouncementResult } from '@mode2API/endpoint/user/PostHomeEndpoint';
import { AnnouncementType } from '@mode2/@types/announcementType';

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

// export type AnnouncementInfoResult = AnnouncementResult[];

export interface AnnouncementInfoResult {
  activityAnnouncements: AnnouncementResult[];
  homeAnnouncements: ParsingAnnouncementResult[];
  hallPopupAnnouncements: ParsingAnnouncementResult[];
}

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

// export interface AnnouncementResult extends ParsingAnnouncementResult {
//   imageSrc: string;
// }

const transformResponse = (
  response: ResponseStructure<AnnouncementInfoResponse>
): AnnouncementInfoResult => {
  const resp = response?.Body;

  const announcements: AnnouncementInfoResponseItem[] = resp || [];

  // 濾除需要的  parameter， 如果為null，isPopup 失效
  const showHallPopupItems =
    announcements?.filter((item) => item.IsPopup === 1) || [];

  // 移除需要 Parameter 檢查
  // 因為 type 999 塞 Parameter
  const hallPopupAnnouncements = useAnnouncementsParameterCheckAndSortOrderId(
    useParsingAnnouncementsContent(
      AnnouncementScenariosType.ALL,
      showHallPopupItems
    )
    // .map((item) => {
    //   return {
    //     ...item,
    //     popupParameterJson:
    //       item.type === AnnouncementType.DYNAMIC_ACTIVITY
    //         ? `{"id": ${item.id}}`
    //         : item.popupParameterJson,
    //   };
    // })
  );

  // TODO Evan 先別移除，給QA看 console

  console.log(
    '@@@===> hall popup (後端控制IsPopup 過濾結果)',
    showHallPopupItems
  );
  console.log(
    '@@@===> hall popup hallPopupAnnouncements',
    hallPopupAnnouncements
  );

  hallPopupAnnouncements.forEach((item) => {
    console.log(
      `@@@===> hall popup (排序結果) type:${item.type}, orderId:${item.orderId}`
    );
  });
  const activityAnnouncements = useParsingAnnouncementsContent(
    AnnouncementScenariosType.ACTIVITY,
    announcements
  );
  const homeAnnouncements = useParsingAnnouncementsContent(
    AnnouncementScenariosType.HOME,
    announcements
  );

  return {
    activityAnnouncements: activityAnnouncements,
    homeAnnouncements: homeAnnouncements,
    hallPopupAnnouncements: hallPopupAnnouncements,
  };
};
