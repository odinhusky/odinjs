import { ExternelEndpoint } from '../../types';
import { ResponseStructure } from '../ResponseStructure';
import { POST_CHANGE_PHONE_URL } from "../../ApiUrl";

interface ChangePhoneRequest {
  phone: string;
}
export const PostChangePhoneEndpoint = (builder: ExternelEndpoint) => builder.mutation<ResponseStructure<null>, ChangePhoneRequest>({
  query: (data: ChangePhoneRequest) => ({
    method: 'post',
    url: POST_CHANGE_PHONE_URL,
    data: data
  })
})