import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}`;

export const getResource = name => {
  return request({
    baseURL,
    url: `/api/resource/${name}/`
  });
};

export const postResource = data => {
  return request({
    baseURL,
    method: 'POST',
    url: '/api/resource/',
    data
  });
};

export const putResource = (params, data) => {
  return request({
    baseURL,
    method: 'PUT',
    url: `/api/resource/${params}`,
    data
  });
};

export const deleteResource = (params) => {
  return request({
    baseURL,
    method: 'DELETE',
    url: `/api/resource/${params}`
  });
};
