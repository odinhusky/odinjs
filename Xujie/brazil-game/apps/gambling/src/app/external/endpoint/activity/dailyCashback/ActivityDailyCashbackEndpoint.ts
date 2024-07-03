import {ExternelEndpoint} from "../../../types";
import {GET_ACTIVITY_DAILY_CASHBACK_URL} from "../../../ApiUrl";
import {ActivityType} from "../ActivityType";

type EmptyRequest = {
    //
};


interface BaseResponse<T> {
    code: number;
    msg: string;
    data: T;
    total: number;
}

type DailyCashbackProviderResponse = {
    provider: string;
    bonus: number;
}

type DailyCashbackTableResponse = {
    upperAmount: number;
    lowerAmount: number;
    providers: DailyCashbackProviderResponse[];
}

enum RewardStatus {
    UNCLAIMED = "UNCLAIMED",
    CLAIMED = "CLAIMED",
    DISCARD = "DISCARD"
}

type DailyCashbackResponse = {
    enabled: boolean;
    bannerContext?: string;
    type: ActivityType;
    content: string;
    yesterdayBets: number;
    todayBonus: number;
    rewardStatus: RewardStatus; //0: UNCLAIMED, 1: CLAIMED, 2: DISCARD , 0为可领取, 其他不能领取
    tables: DailyCashbackTableResponse[];
}


const GetDailyCashbackEndpoint = (builder: ExternelEndpoint) => builder.query<
    BaseResponse<DailyCashbackResponse>,
    EmptyRequest
>({
    query: (query: EmptyRequest) => ({
        method: 'get',
        url: GET_ACTIVITY_DAILY_CASHBACK_URL,
        params: query,
    }),
})


export {
    GetDailyCashbackEndpoint,
    DailyCashbackTableResponse,
    RewardStatus
}