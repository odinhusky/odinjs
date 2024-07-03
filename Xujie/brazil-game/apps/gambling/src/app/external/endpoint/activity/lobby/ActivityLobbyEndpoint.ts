import {ExternelEndpoint} from "../../../types";
import {GET_ACTIVITY_LOBBY_URL} from "../../../ApiUrl";
import {ActivityType} from "../ActivityType";

type EmptyRequest = {
    //
};

export type ActivityLobbyResponse = {
    id: number;
    bannerContext?:string;
    name: string;
    type: ActivityType;
}

interface BaseResponse<T> {
    code: number;
    msg: string;
    data: T;
    total: number;
}

const GetActivityLobbyEndpoint = (builder: ExternelEndpoint) => builder.query<
    BaseResponse<ActivityLobbyResponse[]>,
    EmptyRequest
>({
    query: (query: EmptyRequest) => ({
        method: 'get',
        url: GET_ACTIVITY_LOBBY_URL,
        params: query,
    }),
})

export {
    GetActivityLobbyEndpoint
}