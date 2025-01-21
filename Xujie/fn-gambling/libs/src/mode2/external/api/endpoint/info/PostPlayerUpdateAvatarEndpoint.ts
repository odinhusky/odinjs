import { POST_PLAYER_UPDATE_AVATAR_URL } from '../../urls';
import { ResponseStructure } from '../ResponseStructure';
import { ExternalEndpoint } from '../../types';

export interface PlayerUpdateAvatarRequest {
  avatar: string;
  avatarFrame: string;
}
export type PlayerUpdateAvatarResponse = string;

export const PostPlayerUpdateAvatarEndpoint = (builder: ExternalEndpoint) =>
  builder.mutation<
    ResponseStructure<PlayerUpdateAvatarResponse>,
    PlayerUpdateAvatarRequest
  >({
    query: (data: PlayerUpdateAvatarRequest) => ({
      method: 'post',
      url: POST_PLAYER_UPDATE_AVATAR_URL,
      data: {
        reqData: data,
      },
    }),
  });
