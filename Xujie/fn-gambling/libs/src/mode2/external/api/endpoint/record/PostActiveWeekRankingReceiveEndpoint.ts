import { POST_ACTIVE_WEEK_RANKING_RECEIVE_URL } from '../../urls';
import { ExternalEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';

/**
 * @example
 *
 * Success(有reward):
 * {Code: 200, Msg: "", Body: "Receive successfully!"}
 *
 * Failed(沒reward):
 * {Code: 400, Msg: "No rewards available, please invite more friends!", Body: null}
 */
type ActiveWeekRankingReceiveResponse = string | null;

/** 領取週排行獎勵(跳toast訊息) */
export const PostActiveWeekRankingReceiveEndpoint = (
  builder: ExternalEndpoint
) =>
  builder.mutation<ResponseStructure<ActiveWeekRankingReceiveResponse>, void>({
    query: () => ({
      method: 'post',
      url: POST_ACTIVE_WEEK_RANKING_RECEIVE_URL,
      data: {},
    }),
  });
