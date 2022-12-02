import request from './request';

export const getSystemParam = () => {
  return request({
    url: '/system-parm'
  });
};

export const setSystemParam = data => {
  return request({
    url: '/system-parm',
    method: 'PUT',
    data
  });
};

export const checkGpuOverload = () => {
  return request({
    url: '/prometheus/isGpuOverload'
  });
};

export const getCustomizedSystemParam = () => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: 'api/systemParm/',
    method: 'GET'
  })
}

export const setCustomizedSystemParam = data => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: '/api/systemParm/',
    method: 'PUT',
    data
  });
}

export const getDockerStorageOptsSize = () => {
  return request({
    baseURL: `${window.ENV.javaRestServerUri}`,
    url: '/api/systemParm/static/dockerStorageOptsSize'
  })
}
