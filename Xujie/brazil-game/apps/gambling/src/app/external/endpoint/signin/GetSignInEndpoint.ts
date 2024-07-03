import {ExternelEndpoint} from "../../types";
import {POST_SIGN_IN_RECORD_LIST_URL} from "../../ApiUrl";
import {Page} from "../../types/Page";


type GetSignInRecordResponseData = {
  id: string;
  user_id: string;
  vip_level: string;
  days: number;
  cashback: number;
  bonus: string;
  bonus_finish: string;
  created_at: string;
}

type GetSignInRecordResponse = {
  code: number;
  msg: string;
  data: GetSignInRecordResponseData[];
  page: Page;
}

type GetSignInRecordRequest = {
  limit: number;
  page: number;
  token: string;
}

const PostSignInEndpoint = (builder: ExternelEndpoint) => builder.mutation<GetSignInRecordResponse, GetSignInRecordRequest>({
  query: (requestData: GetSignInRecordRequest) => ({
    method: 'post',
    url: POST_SIGN_IN_RECORD_LIST_URL,
    data: requestData
  })
})


export {
  PostSignInEndpoint,

  GetSignInRecordResponseData
}
