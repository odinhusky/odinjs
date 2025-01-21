import { ExternalEndpoint } from '@mode2API/types';
import { POST_PLAYER_EVENT_REPORT_URL } from '@mode2API/urls';
import { ResponseStructure } from '@mode2API/endpoint/ResponseStructure';
import { isEmpty } from 'lodash';

export interface PlayerEventReportRequest {
  event: string;
}

export const PostPlayerEventReportEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<boolean, PlayerEventReportRequest>({
    query: (data: PlayerEventReportRequest) => ({
      method: 'post',
      url: POST_PLAYER_EVENT_REPORT_URL,
      data: {
        reqData: data,
      },
    }),
    transformResponse,
  });

const transformResponse = (response: ResponseStructure<string>): boolean => {
  const resp = response?.Body;
  return !isEmpty(resp);
};
