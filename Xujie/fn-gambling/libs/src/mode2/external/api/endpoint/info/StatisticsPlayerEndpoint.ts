import { POST_STATISTICS_PLAYER_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export type StatisticsPlayerRequest = {
  /* define request fields */
};
export type StatisticsPlayerResponse = {
  Register: number;
  Time: number;
  Win: number;
};

export const StatisticsPlayerEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<
    ResponseStructure<StatisticsPlayerResponse>,
    StatisticsPlayerRequest
  >({
    query: (data: StatisticsPlayerRequest) => ({
      method: 'post',
      url: POST_STATISTICS_PLAYER_URL,
      data,
    }),
  });
