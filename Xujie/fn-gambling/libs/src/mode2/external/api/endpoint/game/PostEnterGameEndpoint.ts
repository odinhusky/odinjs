import { POST_GAME_ENTER_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export interface EnterGameRequest {
  gameId: number;
}

export interface EnterGameResponse {
  LaunchType?: number;
  Url?: string;
  IsUrl?: boolean;
}

/** 獲取要前往的遊戲url＆啟動類型 */
export const PostEnterGameEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<EnterGameResult, EnterGameRequest>({
    query: (data: EnterGameRequest) => ({
      method: 'post',
      url: POST_GAME_ENTER_URL,
      data: {
        reqData: data,
      },
    }),

    transformResponse,
  });

// 1=iframe 2=跳转
export enum LaunchType {
  IFRAME = 1,
  REDIRECT = 2,
}

export type EnterGameResult = {
  url: string; // redirect url or iframe url
  launchType: LaunchType;
};

const defaultResult = {
  url: '',
  launchType: LaunchType.IFRAME,
};

const transformResponse = (
  response: ResponseStructure<EnterGameResponse>
): EnterGameResult => {
  const resp = response?.Body;
  if (resp) {
    return {
      url: resp.Url || defaultResult.url,
      launchType: resp.LaunchType || defaultResult.launchType,
    };
  }
  return defaultResult;
};
