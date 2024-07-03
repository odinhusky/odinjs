import { ExternelEndpoint } from '../../types';
import { GET_NOTICE_MARQUEES_URL } from '../../ApiUrl';
import { ResponseStructure } from '../ResponseStructure';

interface NoticeMarqueesResponse {
  id?: number;
  title?: string; // 標題
  content?: string; // 內容
  status?: number; // 公告状态，0关闭，1开启
  listOrder?: number; // 排序，默认0，可以设置，越大越靠前
  type?: number; // 消息类型，0:消息、1:跑马灯
  // clubId: 0;
  // createdAt: 0;
  // updatedAt: 0;
}

export const GetNoticeMarqueesEndpoint = (builder: ExternelEndpoint) =>
  builder.query<ResponseStructure<NoticeMarqueesResponse[]>, null>({
    query: () => ({
      method: 'get',
      url: GET_NOTICE_MARQUEES_URL,
    }),
  });
