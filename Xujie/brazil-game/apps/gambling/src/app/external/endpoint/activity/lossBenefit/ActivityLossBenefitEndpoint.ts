import {ExternelEndpoint} from "../../../types";
import {GET_ACTIVITY_LOSS_BENEFIT_URL,} from "../../../ApiUrl";
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

type LossBenefitProviderResponse = {
    provider: string;
    bonus: number;
}

type LossBenefitTableResponse = {
    upperAmount: number;
    lowerAmount: number;
    providers: LossBenefitProviderResponse[];
}

enum RewardStatus {
    UNCLAIMED = "UNCLAIMED",
    CLAIMED = "CLAIMED",
    DISCARD = "DISCARD"
}

type LossBenefitResponse = {
    enabled: boolean;
    bannerContext?: string;
    type: ActivityType;
    content: string;
    yesterdayLoss: number;
    todayBonus: number;
    rewardStatus: RewardStatus;
    tables: LossBenefitTableResponse[];
}


const GetLossBenefitEndpoint = (builder: ExternelEndpoint) => builder.query<
    BaseResponse<LossBenefitResponse>,
    EmptyRequest
>({
    query: (query: EmptyRequest) => ({
        method: 'get',
        url: GET_ACTIVITY_LOSS_BENEFIT_URL,
        params: query,
    }),
})


export {
    GetLossBenefitEndpoint,
    LossBenefitTableResponse,
    RewardStatus
}