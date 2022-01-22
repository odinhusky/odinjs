import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getJobTemplate = () => {
  return request({
    baseURL,
    url: '/jobTemplate/'
  })
}

export const getCanReadJobTemplate = name => {
  return request({
    baseURL,
    url: `/user/${name}/canReadJobTemplates/`
  })
}

export const postJobTemplate = data => {
  return request({
    baseURL,
    url: '/jobTemplate/',
    method: 'POST',
    data
  })
}

export const deleteJobTemplate = id => {
  return request({
    baseURL,
    url: `/jobTemplate/${id}`,
    method: 'DELETE'
  })
}