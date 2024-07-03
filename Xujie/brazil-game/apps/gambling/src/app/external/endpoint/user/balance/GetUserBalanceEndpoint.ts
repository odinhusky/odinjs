import {ExternelEndpoint} from "../../../types";
import {GET_USER_BALANCE_SIMPLE_DATA_URL, GET_USER_BALANCE_URL} from "../../../ApiUrl";

type EmptyRequest = {
  //
};

type GetBalanceRequest = {
  token: string;
}

type GetBalanceData = {
  balances: {
    type: string;
    amount: number;
  }[]
}

type GetBalanceResponse = {
  code: number;
  msg: string;
  data: GetBalanceData;
}

const GetUserBalanceEndpoint = (builder: ExternelEndpoint) => builder.query<GetBalanceResponse, GetBalanceRequest>({
  query: (data: GetBalanceRequest) => ({
    method: 'get',
    url: GET_USER_BALANCE_URL,
    data,
  })
})


type GetBoxSimpleBalanceResponse = {
  code: number;
  msg: any;
  data: {
    amount: number;
    withdrawAmount: number;
    inviteAmount: number;
  };
  total: number;
};
const GetUserBalanceSimpleDataEndpoint = (builder: ExternelEndpoint) => builder.query<
  GetBoxSimpleBalanceResponse,
  EmptyRequest
>({
  query: (query: EmptyRequest) => ({
    method: 'get',
    url: GET_USER_BALANCE_SIMPLE_DATA_URL,
    params: query,
  }),
})

export {
  GetUserBalanceEndpoint,
  GetUserBalanceSimpleDataEndpoint,
}
