import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getNotificationAddress = username => {
  return request({
    baseURL,
    url: `/user/${username}/notice/destination`
  });
}

export const getUserNotices = username => {
  return request({
    baseURL,
    url: `/user/${username}/notice`
  })
}
