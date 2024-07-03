import {ExternelEndpoint} from "../../../types";
import {GET_USER_EXTRA_INFO_URL} from "../../../ApiUrl";


type EmptyRequest = {
  //
};

type ExtraInfoResponse = {
  code: number;
  msg: any;
  data: {
    teleStatus: string;
    rechargeStatus: string;
  };
  total: number;
};

const GetUserExtraInfoEndpoint = (builder: ExternelEndpoint) => builder.query<ExtraInfoResponse, EmptyRequest>({
  query: (query: EmptyRequest) => ({
    method: 'get',
    url: GET_USER_EXTRA_INFO_URL,
    params: query,
  }),
})


export {
  GetUserExtraInfoEndpoint
}
