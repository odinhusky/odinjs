import request from './request';

const baseURL = `${window.ENV.javaRestServerUri}/api`;

export const getJobQueue = params => {
  return request({
    baseURL,
    url: '/jobQueue/',
    params
  });
};

export const moveBeforeJobQueue = (jobName, targetName) => {
  return request({
    baseURL,
    url: `/jobQueue/${jobName}/moveBefore`,
    data: {
      jobName: targetName
    },
    method: 'PUT'
  });
};

export const deleteJobQueue = jobName => {
  return request({
    baseURL,
    url: `/jobQueue/${jobName}`,
    method: 'DELETE'
  });
};
