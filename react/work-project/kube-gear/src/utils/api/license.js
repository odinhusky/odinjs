import request from './request';

export const getLicense = () => {
  return request({
    url: '/license/sentinel/check'
  });
};
