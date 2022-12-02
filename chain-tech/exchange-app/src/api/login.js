import request from 'utils/http-common'

export function reqLogin(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}
