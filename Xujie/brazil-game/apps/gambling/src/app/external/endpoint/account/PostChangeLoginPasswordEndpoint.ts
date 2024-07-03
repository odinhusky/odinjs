import { ExternelEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { POST_CHANGE_LOGIN_PASSWORD_URL } from "../../ApiUrl";

interface ChangeLoginPasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const PostChangeLoginPasswordEndpoint =  (builder: ExternelEndpoint) => builder.mutation<ResponseStructure<null>, ChangeLoginPasswordRequest>({
  query: (data: ChangeLoginPasswordRequest) => ({
    method: 'post',
    url: POST_CHANGE_LOGIN_PASSWORD_URL,
    data: data
  })
})