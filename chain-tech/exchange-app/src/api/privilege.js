import request from 'utils/http-common'

export function getPrivilegesInfo() {
  return request({
    url: '/manage/privilege',
    method: 'get',
  })
}