import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}`;

export const getLoginInfo = params => {
  return request({
    baseURL,
    url: '/api/signinLog/',
    params
  });
};
