import request from 'utils/http-common'

export function reqUserInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}