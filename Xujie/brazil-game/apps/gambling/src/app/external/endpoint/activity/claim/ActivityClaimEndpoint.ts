import {ExternelEndpoint} from "../../../types";
import {POST_ACTIVITY_CLAIM_URL, POST_EXTERNAL_GAME_START_URL} from "../../../ApiUrl";


interface BaseResponse<T> {
    code: number;
    msg: string;
    data: T;
    total: number;
}

type ActivityHistoryRecordRequest = {
    activityType: string;
}

const PostActivityClaimEndpoint = (builder: ExternelEndpoint) => builder.mutation<
    BaseResponse<any>,
    ActivityHistoryRecordRequest
>({
    query: (query: ActivityHistoryRecordRequest) => {
        const {activityType} = query
        return {
            method: 'post',
            url: POST_ACTIVITY_CLAIM_URL(activityType),
        }
    }
})

export {
    PostActivityClaimEndpoint
}