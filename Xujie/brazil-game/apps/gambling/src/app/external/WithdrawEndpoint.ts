import {ExternelEndpoint} from "./types";
import {POST_WITHDRAW_URL} from "./ApiUrl";

export interface WithdrawResponse {
  "code": number;
  "msg": string;
}

// pix chave 类型有5种，分别是EMAIL/PHONE/CPF/CNPJ/EVP，
// 同样pix 键就是上面5种格式，CPF:11位数；PHONE:11位数(可加前缀'+55')；EMAIL:邮箱格式；CNPJ:14位数；EVP: uuid格式


export type AccountType = 1 | 2 | 3;
export interface WithdrawRequest {
  token: string;
  app_package_name: string;
  app_version: string;
  amount: number;
  //
  pix: {
    customerName: string;
    // CPF
    customerCert: string;
    // 1:表示 CPF 2表示email 3表示手机号码
    accountType: AccountType;
    accountNum: string;
  }
}

export const WithdrawEndpoint = (builder: ExternelEndpoint) =>
  builder.mutation<WithdrawResponse, WithdrawRequest>({
  query: (requestData: WithdrawRequest) => ({
    url: POST_WITHDRAW_URL,
    method: "post",
    data: requestData,
  })

})
