import {ExternelEndpoint} from "../../../types";
import {POST_BOX_CLAIM} from "../../../ApiUrl";

type PostBoxClaimEndResponse = {
  code: number;
  msg: string
}


export const PostBoxClaimEndpoint = (builder: ExternelEndpoint) => builder.mutation<PostBoxClaimEndResponse, { inviteNum: number }>({
  query: (data) => ({
    method: 'post',
    url: POST_BOX_CLAIM,
    data
  })
})