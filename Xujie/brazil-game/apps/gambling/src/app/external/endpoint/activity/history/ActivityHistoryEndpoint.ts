import {ExternelEndpoint} from "../../../types";
import {
    GET_ACTIVITY_HISTORY_URL,
    GET_ACTIVITY_HISTORY_RECORD_URL
} from "../../../ApiUrl";


type EmptyRequest = {
    //
};

interface BaseResponse<T> {
    code: number;
    msg: string;
    data: T;
    total: number;
}

type ActivityHistoryResponse = {
    id: number;
    title: string;
    type: string;
}

const GetActivityHistoryEndpoint = (builder: ExternelEndpoint) => builder.query<
    BaseResponse<ActivityHistoryResponse[]>,
    EmptyRequest
>({
    query: (query: EmptyRequest) => ({
        method: 'get',
        url: GET_ACTIVITY_HISTORY_URL,
        params: query,
    }),
})


type ActivityHistoryRecordRequest = {
    activityId?: string| null;
    dayOfDuration: number;
}

type ActivityHistoryRecordResponse = {
    claimTime: string;
    actName: string;
    bonus: number;
    status: number;
    ip: string;
}

const GetActivityHistoryRecordEndpoint = (builder: ExternelEndpoint) => builder.query<
    BaseResponse<ActivityHistoryRecordResponse[]>,
    ActivityHistoryRecordRequest
>({
    query: (query: ActivityHistoryRecordRequest) => ({
        method: 'get',
        url: GET_ACTIVITY_HISTORY_RECORD_URL,
        params: query,
    }),
})


export {
    ActivityHistoryResponse,
    ActivityHistoryRecordResponse,
    GetActivityHistoryEndpoint,
    GetActivityHistoryRecordEndpoint
}