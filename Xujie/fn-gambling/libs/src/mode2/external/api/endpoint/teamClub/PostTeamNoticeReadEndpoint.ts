import { ExternalEndpoint } from '@mode2API/types';
import { POST_TEAM_NOTICE_READ_URL } from '@mode2API/urls';


// 直接在list已讀，不再走api，棄用
export interface TeamNoticeReadPayload {
  playerId: number; // 下級成員 Id
}

interface TeamNoticeReadRequest {
  invitee: number;
}

export interface TeamNoticeReadResult {
  playerId: number;
}

export const PostTeamNoticeReadEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<TeamNoticeReadResult, TeamNoticeReadPayload>({
    query: (payload) => {
      const request: TeamNoticeReadRequest = { invitee: payload.playerId };
      return {
        method: 'post',
        url: POST_TEAM_NOTICE_READ_URL,
        data: { ...request },
      };
    },
    transformResponse,
  });

const transformResponse = (
  response: void,
  meta: unknown,
  arg: TeamNoticeReadPayload
): TeamNoticeReadResult => {
  return {
    playerId: arg.playerId,
  };
};

export default PostTeamNoticeReadEndpoint;
