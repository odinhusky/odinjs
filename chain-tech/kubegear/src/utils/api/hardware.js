import request from './request';

const baseURL = `${window.ENV.prometheusUri}/api/v1/`;
const javaRestURL = `${window.ENV.javaRestServerUri}/api/`
const authPrometheus = {
  username: 'admin',
  password: 'yXPu9uSJiIBDGZZq7Z6z'
}

export const getHardwareInfo = params => {
  return request({
    baseURL,
    url: '/query',
    auth: authPrometheus,
    params
  });
};

export const getHardwareInfoRange = params => {
  return request({
    baseURL,
    url: '/query_range',
    auth: authPrometheus,
    params
  });
};

export const getTotalHostInfo = params => {
  return request({
    baseURL,
    url: 'series',
    auth: authPrometheus,
    params
  })
}

export const shutdownNode = data => {
  return request({
    method: 'POST',
    baseURL: javaRestURL,
    url: '/node/shutdown',
    data
  })
}

export const rebootNode = data => {
  return request({
    method: 'POST',
    baseURL: javaRestURL,
    url: '/node/reboot',
    data
  })
}

export const getNodeState = () => {
  return request({
    url: '/kubernetes/nodes'
  })
}

export const getNodeDockerImages = params => {
  return request({
    baseURL: javaRestURL,
    url: '/node/docker/images/',
    params
  })
}

export const getNodeDockerStorage = params => {
  return request({
    baseURL: javaRestURL,
    url: '/node/docker/storage/',
    params
  })
}

export const postNodeDockerImagesPrune = (data, isDangling) => {
  return request({
    baseURL: javaRestURL,
    method: 'POST',
    url: `/node/docker/images/prune?dangling=${isDangling}`,
    data
  })
}

export const deleteNodeDockerImage = data => {
  return request({
    baseURL: javaRestURL,
    method: 'DELETE',
    url: '/node/docker/images/',
    data
  })
}
